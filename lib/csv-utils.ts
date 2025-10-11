// Utilitaire pour parser les données CSV
export interface CityData {
  name: string;
  capacity?: number; // Optionnel car pas dans votre CSV
  risk: string;
  criminalite: number;
  pollution: number;
  infrastructure: number;
  lat?: number; // Coordonnées GPS
  lng?: number;
  // Ajoutez d'autres propriétés selon votre CSV
  [key: string]: any;
}

export interface NationalStats {
  totalCapacity: number;
  averageCriminalite: number;
  averagePollution: number;
  averageInfrastructure: number;
  totalMatches: number;
  expectedVisitors: number;
}

// Fonction pour parser une ligne CSV
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Fonction pour parser le contenu CSV complet
export function parseCSV(csvContent: string): CityData[] {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    throw new Error('Le fichier CSV doit contenir au moins un en-tête et une ligne de données');
  }
  
  const headers = parseCSVLine(lines[0]);
  const data: CityData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const cityData: CityData = {} as CityData;
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      // Conversion des types selon le nom de la colonne
      if (header.toLowerCase().includes('indice_criminalite') || 
          header.toLowerCase().includes('indice_pollution') ||
          header.toLowerCase().includes('score_infrastructures') ||
          header.toLowerCase().includes('lat') ||
          header.toLowerCase().includes('lng') ||
          header.toLowerCase().includes('capacity')) {
        cityData[header] = parseFloat(value) || 0;
      } else if (header.toLowerCase().includes('ville')) {
        cityData['name'] = value;
      } else if (header.toLowerCase().includes('niveau_global_risque') || 
                 header.toLowerCase().includes('niveauglobalrisque')) {
        cityData['risk'] = value;
      } else {
        cityData[header] = value;
      }
    });
    
    data.push(cityData);
  }
  
  return data;
}

// Fonction pour calculer les statistiques nationales à partir des données des villes
export function calculateNationalStats(cities: CityData[]): NationalStats {
  // Si pas de capacité dans le CSV, utiliser des valeurs par défaut
  const defaultCapacities: { [key: string]: number } = {
    'Casablanca': 115000,
    'Tanger': 76000,
    'Rabat': 68000,
    'Fès': 55000,
    'Agadir': 46000,
    'Marrakech': 45000
  };
  
  const totalCapacity = cities.reduce((sum, city) => {
    return sum + (city.capacity || defaultCapacities[city.name] || 50000);
  }, 0);
  
  const averageCriminalite = cities.reduce((sum, city) => sum + (city.Indice_Criminalite || city.criminalite || 0), 0) / cities.length;
  const averagePollution = cities.reduce((sum, city) => sum + (city.Indice_Pollution || city.pollution || 0), 0) / cities.length;
  const averageInfrastructure = cities.reduce((sum, city) => sum + (city.Score_Infrastructures || city.infrastructure || 0), 0) / cities.length;
  
  return {
    totalCapacity,
    averageCriminalite: Math.round(averageCriminalite),
    averagePollution: Math.round(averagePollution),
    averageInfrastructure: Math.round(averageInfrastructure * 10) / 10,
    totalMatches: 32, // Valeur fixe pour la Coupe du Monde
    expectedVisitors: 2500000, // Valeur fixe
  };
}

// Fonction pour mapper les données CSV vers le format attendu par le composant
export function mapCSVToCityComparison(csvData: CityData[]): CityData[] {
  const defaultCapacities: { [key: string]: number } = {
    'Casablanca': 115000,
    'Tanger': 76000,
    'Rabat': 68000,
    'Fès': 55000,
    'Agadir': 46000,
    'Marrakech': 45000
  };
  
  return csvData.map(city => ({
    name: city.name || '',
    capacity: city.capacity || defaultCapacities[city.name] || 50000,
    risk: city.risk || city.NiveauGlobalRisque || 'Faible',
    criminalite: city.Indice_Criminalite || city.criminalite || 0,
    pollution: city.Indice_Pollution || city.pollution || 0,
    infrastructure: city.Score_Infrastructures || city.infrastructure || 0,
    lat: city.lat || 0,
    lng: city.lng || 0,
    // Conserver toutes les données originales
    ...city
  }));
}
