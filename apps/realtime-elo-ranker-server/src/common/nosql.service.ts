import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

/**
 * Service NoSQL simple basé sur JSON pour la persistance des données
 * Stocke les données dans des fichiers JSON locaux
 */
@Injectable()
export class NoSQLService {
  private dbPath: string;
  private collections: Map<string, any[]> = new Map();

  constructor() {
    // Créer le répertoire de la BD s'il n'existe pas
    this.dbPath = path.join(process.cwd(), 'data');
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }

    // Charger toutes les collections au démarrage
    this.loadCollections();
  }

  /**
   * Charge toutes les collections depuis les fichiers JSON
   */
  private loadCollections(): void {
    const files = fs.readdirSync(this.dbPath).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      const collectionName = file.replace('.json', '');
      const filePath = path.join(this.dbPath, file);
      try {
        const data = fs.readFileSync(filePath, 'utf-8');
        this.collections.set(collectionName, JSON.parse(data));
      } catch (error) {
        console.log(`Collection ${collectionName} vide ou nouvelle`);
        this.collections.set(collectionName, []);
      }
    });
  }

  /**
   * Sauvegarde une collection dans un fichier JSON
   */
  private saveCollection(collectionName: string): void {
    const filePath = path.join(this.dbPath, `${collectionName}.json`);
    const data = this.collections.get(collectionName) || [];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Obtient une collection
   */
  getCollection(collectionName: string): any[] {
    if (!this.collections.has(collectionName)) {
      this.collections.set(collectionName, []);
    }
    return this.collections.get(collectionName) || [];
  }

  /**
   * Insère un document dans une collection
   */
  insert(collectionName: string, document: any): any {
    const collection = this.getCollection(collectionName);
    const doc = {
      ...document,
      _id: document._id || this.generateId(),
      createdAt: document.createdAt || new Date(),
      updatedAt: document.updatedAt || new Date(),
    };
    collection.push(doc);
    this.saveCollection(collectionName);
    return doc;
  }

  /**
   * Trouve tous les documents d'une collection
   */
  find(collectionName: string): any[] {
    return this.getCollection(collectionName);
  }

  /**
   * Trouve un document par ID
   */
  findById(collectionName: string, id: string): any {
    const collection = this.getCollection(collectionName);
    return collection.find(doc => doc._id === id || doc.id === id);
  }

  /**
   * Trouve le premier document correspondant à un filtre
   */
  findOne(collectionName: string, filter: any): any {
    const collection = this.getCollection(collectionName);
    return collection.find(doc => this.matchesFilter(doc, filter));
  }

  /**
   * Met à jour un document par ID
   */
  updateById(collectionName: string, id: string, updates: any): any {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex(doc => doc._id === id || doc.id === id);
    if (index === -1) return null;

    collection[index] = {
      ...collection[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveCollection(collectionName);
    return collection[index];
  }

  /**
   * Supprime un document par ID
   */
  deleteById(collectionName: string, id: string): boolean {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex(doc => doc._id === id || doc.id === id);
    if (index === -1) return false;

    collection.splice(index, 1);
    this.saveCollection(collectionName);
    return true;
  }

  /**
   * Supprime tous les documents d'une collection
   */
  deleteAll(collectionName: string): void {
    this.collections.set(collectionName, []);
    this.saveCollection(collectionName);
  }

  /**
   * Compte les documents d'une collection
   */
  count(collectionName: string): number {
    return this.getCollection(collectionName).length;
  }

  /**
   * Vérifie si un document existe
   */
  exists(collectionName: string, id: string): boolean {
    return this.findById(collectionName, id) !== undefined;
  }

  /**
   * Classe les documents et retourne les N premiers
   */
  findSorted(collectionName: string, sortKey: string, order: 'asc' | 'desc' = 'desc', limit?: number): any[] {
    const collection = this.getCollection(collectionName);
    const sorted = [...collection].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (order === 'desc') {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Vérifie si un document correspond à un filtre
   */
  private matchesFilter(doc: any, filter: any): boolean {
    return Object.keys(filter).every(key => doc[key] === filter[key]);
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Exporte les données (pour sauvegarde)
   */
  exportData(): any {
    const data = {};
    this.collections.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  /**
   * Importe les données (pour restauration)
   */
  importData(data: any): void {
    Object.keys(data).forEach(key => {
      this.collections.set(key, data[key]);
      this.saveCollection(key);
    });
  }
}
