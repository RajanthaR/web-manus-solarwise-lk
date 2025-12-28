// Seed script for SolarWise LK database
// Run with: node scripts/seed-data.mjs

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log('🌱 Seeding database...');

  // ============ HARDWARE BRANDS ============
  console.log('Adding hardware brands...');
  const brands = [
    { name: 'JA Solar', country: 'China', description: 'One of the largest solar manufacturers globally' },
    { name: 'Jinko Solar', country: 'China', description: 'World leading solar panel manufacturer' },
    { name: 'LONGi', country: 'China', description: 'Leading mono-crystalline silicon producer' },
    { name: 'Canadian Solar', country: 'Canada', description: 'Global solar solutions provider' },
    { name: 'Trina Solar', country: 'China', description: 'Smart energy solutions provider' },
    { name: 'Growatt', country: 'China', description: 'Leading inverter manufacturer' },
    { name: 'Huawei', country: 'China', description: 'Premium inverter technology' },
    { name: 'Solis', country: 'China', description: 'Reliable inverter solutions' },
    { name: 'SMA', country: 'Germany', description: 'Premium German engineering' },
    { name: 'Fronius', country: 'Austria', description: 'Austrian quality inverters' },
    { name: 'BYD', country: 'China', description: 'Leading battery technology' },
    { name: 'Pylontech', country: 'China', description: 'LFP battery specialist' },
  ];

  for (const brand of brands) {
    await connection.execute(
      `INSERT INTO hardware_brands (name, country, description) VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE country = VALUES(country), description = VALUES(description)`,
      [brand.name, brand.country, brand.description]
    );
  }

  // Get brand IDs
  const [brandRows] = await connection.execute('SELECT id, name FROM hardware_brands');
  const brandMap = Object.fromEntries(brandRows.map(b => [b.name, b.id]));

  // ============ SOLAR PANELS ============
  console.log('Adding solar panels...');
  const panels = [
    {
      brandId: brandMap['JA Solar'],
      model: 'JAM72S30-545/MR',
      wattage: 545,
      efficiency: '21.3',
      cellType: 'Mono PERC',
      warrantyYears: 25,
      degradationAnnual: '0.45',
      output25Years: '87.4',
      qualityScore: '8.5',
      pros: JSON.stringify(['High efficiency', 'Good warranty', 'Reliable brand']),
      cons: JSON.stringify(['Mid-range price', 'Standard aesthetics']),
      reviewSummary: 'Excellent value for money with proven reliability in Sri Lankan conditions.',
    },
    {
      brandId: brandMap['Jinko Solar'],
      model: 'Tiger Neo N-type 580W',
      wattage: 580,
      efficiency: '22.53',
      cellType: 'N-type TOPCon',
      warrantyYears: 30,
      degradationAnnual: '0.40',
      output25Years: '89.4',
      qualityScore: '8.5',
      pros: JSON.stringify(['Top efficiency', 'Low degradation', 'N-type technology']),
      cons: JSON.stringify(['Premium price', 'Larger size']),
      reviewSummary: 'Premium panel with excellent long-term performance and low degradation.',
    },
    {
      brandId: brandMap['LONGi'],
      model: 'Hi-MO 5 LR5-72HPH-550M',
      wattage: 550,
      efficiency: '21.3',
      cellType: 'Mono PERC',
      warrantyYears: 25,
      degradationAnnual: '0.45',
      output25Years: '87.4',
      qualityScore: '9.0',
      pros: JSON.stringify(['Industry leader', 'Excellent quality control', 'Strong warranty']),
      cons: JSON.stringify(['Higher price point']),
      reviewSummary: 'World-leading mono-crystalline technology with exceptional reliability.',
    },
    {
      brandId: brandMap['Canadian Solar'],
      model: 'HiKu7 CS7L-595MS',
      wattage: 595,
      efficiency: '21.8',
      cellType: 'Mono PERC',
      warrantyYears: 25,
      degradationAnnual: '0.45',
      output25Years: '87.4',
      qualityScore: '8.0',
      pros: JSON.stringify(['High wattage', 'Good value', 'Strong brand']),
      cons: JSON.stringify(['Large panel size', 'Heavier weight']),
      reviewSummary: 'Great high-wattage option with solid Canadian backing.',
    },
    {
      brandId: brandMap['Trina Solar'],
      model: 'Vertex S+ TSM-NEG9R.28',
      wattage: 440,
      efficiency: '22.0',
      cellType: 'N-type',
      warrantyYears: 25,
      degradationAnnual: '0.40',
      output25Years: '89.0',
      qualityScore: '8.0',
      pros: JSON.stringify(['Compact size', 'Good for residential', 'N-type efficiency']),
      cons: JSON.stringify(['Lower wattage per panel']),
      reviewSummary: 'Ideal for residential rooftops with space constraints.',
    },
  ];

  for (const panel of panels) {
    await connection.execute(
      `INSERT INTO solar_panels (brandId, model, wattage, efficiency, cellType, warrantyYears, degradationAnnual, output25Years, qualityScore, pros, cons, reviewSummary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE efficiency = VALUES(efficiency), qualityScore = VALUES(qualityScore)`,
      [panel.brandId, panel.model, panel.wattage, panel.efficiency, panel.cellType, panel.warrantyYears, panel.degradationAnnual, panel.output25Years, panel.qualityScore, panel.pros, panel.cons, panel.reviewSummary]
    );
  }

  // ============ INVERTERS ============
  console.log('Adding inverters...');
  const inverters = [
    {
      brandId: brandMap['Growatt'],
      model: 'MIN 5000TL-X',
      type: 'string',
      capacity: '5.0',
      efficiency: '98.4',
      mpptTrackers: 2,
      phases: 'single',
      warrantyYears: 10,
      features: JSON.stringify(['WiFi monitoring', 'Export limitation', 'IP65 rated']),
      qualityScore: '7.0',
      pros: JSON.stringify(['Affordable', 'Good monitoring app', 'Easy installation']),
      cons: JSON.stringify(['Fan noise at high load', 'Basic app interface']),
      reviewSummary: 'Best value for money in Sri Lanka. Good for budget-conscious installations.',
    },
    {
      brandId: brandMap['Growatt'],
      model: 'SPH 5000TL BL-UP',
      type: 'hybrid',
      capacity: '5.0',
      efficiency: '97.6',
      mpptTrackers: 2,
      phases: 'single',
      warrantyYears: 10,
      features: JSON.stringify(['Battery ready', 'Backup power', 'Smart load control']),
      qualityScore: '7.5',
      pros: JSON.stringify(['Battery compatible', 'Backup function', 'Good value hybrid']),
      cons: JSON.stringify(['Requires Growatt batteries', 'Complex setup']),
      reviewSummary: 'Popular hybrid choice for homes wanting battery backup capability.',
    },
    {
      brandId: brandMap['Huawei'],
      model: 'SUN2000-5KTL-M1',
      type: 'string',
      capacity: '5.0',
      efficiency: '98.6',
      mpptTrackers: 2,
      phases: 'single',
      warrantyYears: 10,
      features: JSON.stringify(['AI optimization', 'Arc fault detection', 'Premium monitoring']),
      qualityScore: '9.0',
      pros: JSON.stringify(['Top efficiency', 'Excellent monitoring', 'Premium build quality']),
      cons: JSON.stringify(['Higher price', 'Requires Huawei optimizer for best results']),
      reviewSummary: 'Premium choice with industry-leading efficiency and smart features.',
    },
    {
      brandId: brandMap['Solis'],
      model: 'S6-GR1P5K',
      type: 'string',
      capacity: '5.0',
      efficiency: '97.8',
      mpptTrackers: 2,
      phases: 'single',
      warrantyYears: 10,
      features: JSON.stringify(['Compact design', 'Export control', 'WiFi included']),
      qualityScore: '7.5',
      pros: JSON.stringify(['Reliable', 'Good support in SL', 'Compact']),
      cons: JSON.stringify(['Basic monitoring', 'Mid-tier efficiency']),
      reviewSummary: 'Reliable workhorse with good local support network.',
    },
    {
      brandId: brandMap['SMA'],
      model: 'Sunny Boy 5.0',
      type: 'string',
      capacity: '5.0',
      efficiency: '97.2',
      mpptTrackers: 2,
      phases: 'single',
      warrantyYears: 10,
      features: JSON.stringify(['German engineering', 'SMA Smart Connected', 'Shade optimization']),
      qualityScore: '9.0',
      pros: JSON.stringify(['Premium quality', 'Excellent warranty support', 'Proven reliability']),
      cons: JSON.stringify(['Highest price', 'Overkill for basic installations']),
      reviewSummary: 'German premium quality for those who want the best.',
    },
    {
      brandId: brandMap['Fronius'],
      model: 'Primo GEN24 5.0 Plus',
      type: 'hybrid',
      capacity: '5.0',
      efficiency: '98.0',
      mpptTrackers: 2,
      phases: 'single',
      warrantyYears: 10,
      features: JSON.stringify(['Emergency power', 'Battery ready', 'PV Point']),
      qualityScore: '8.5',
      pros: JSON.stringify(['Austrian quality', 'Excellent hybrid features', 'Emergency power']),
      cons: JSON.stringify(['Premium price', 'Limited battery compatibility']),
      reviewSummary: 'Top-tier hybrid inverter with excellent emergency power features.',
    },
  ];

  for (const inverter of inverters) {
    await connection.execute(
      `INSERT INTO inverters (brandId, model, type, capacity, efficiency, mpptTrackers, phases, warrantyYears, features, qualityScore, pros, cons, reviewSummary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE efficiency = VALUES(efficiency), qualityScore = VALUES(qualityScore)`,
      [inverter.brandId, inverter.model, inverter.type, inverter.capacity, inverter.efficiency, inverter.mpptTrackers, inverter.phases, inverter.warrantyYears, inverter.features, inverter.qualityScore, inverter.pros, inverter.cons, inverter.reviewSummary]
    );
  }

  // ============ BATTERIES ============
  console.log('Adding batteries...');
  const batteries = [
    {
      brandId: brandMap['BYD'],
      model: 'Battery-Box Premium HVS 5.1',
      type: 'lfp',
      capacityKwh: '5.12',
      voltage: 204,
      cycleLife: 6000,
      depthOfDischarge: '96',
      warrantyYears: 10,
      qualityScore: '9.0',
      pros: JSON.stringify(['Excellent cycle life', 'Safe LFP chemistry', 'Modular design']),
      cons: JSON.stringify(['Premium price', 'Requires compatible inverter']),
      reviewSummary: 'Industry-leading battery with excellent safety and longevity.',
    },
    {
      brandId: brandMap['Pylontech'],
      model: 'US3000C',
      type: 'lfp',
      capacityKwh: '3.55',
      voltage: 48,
      cycleLife: 6000,
      depthOfDischarge: '90',
      warrantyYears: 10,
      qualityScore: '8.0',
      pros: JSON.stringify(['Good value', 'Stackable', 'Wide compatibility']),
      cons: JSON.stringify(['Lower capacity per unit', 'Basic monitoring']),
      reviewSummary: 'Popular choice for budget-friendly battery storage.',
    },
    {
      brandId: brandMap['Growatt'],
      model: 'ARK 5.1H-A1',
      type: 'lithium',
      capacityKwh: '5.12',
      voltage: 51,
      cycleLife: 6000,
      depthOfDischarge: '90',
      warrantyYears: 10,
      qualityScore: '7.0',
      pros: JSON.stringify(['Works with Growatt inverters', 'Good price', 'Easy setup']),
      cons: JSON.stringify(['Limited to Growatt systems', 'Basic features']),
      reviewSummary: 'Best paired with Growatt hybrid inverters for seamless integration.',
    },
  ];

  for (const battery of batteries) {
    await connection.execute(
      `INSERT INTO batteries (brandId, model, type, capacityKwh, voltage, cycleLife, depthOfDischarge, warrantyYears, qualityScore, pros, cons, reviewSummary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE capacityKwh = VALUES(capacityKwh), qualityScore = VALUES(qualityScore)`,
      [battery.brandId, battery.model, battery.type, battery.capacityKwh, battery.voltage, battery.cycleLife, battery.depthOfDischarge, battery.warrantyYears, battery.qualityScore, battery.pros, battery.cons, battery.reviewSummary]
    );
  }

  // ============ PROVIDERS ============
  console.log('Adding providers...');
  const providers = [
    {
      name: 'Hayleys Solar',
      nameSinhala: 'හේලීස් සෝලාර්',
      website: 'https://www.hayleyssolar.com',
      phone: '+94 11 234 5678',
      address: 'Colombo, Sri Lanka',
      description: 'Leading solar solutions provider in Sri Lanka with premium hardware partnerships.',
      rating: '4.5',
    },
    {
      name: 'JLanka Technologies',
      nameSinhala: 'ජේලංකා ටෙක්නොලොජීස්',
      website: 'https://jlanka.com',
      phone: '+94 11 456 7890',
      address: 'Colombo, Sri Lanka',
      description: 'Comprehensive solar solutions with competitive pricing and installation services.',
      rating: '4.3',
    },
    {
      name: 'WinSolar',
      nameSinhala: 'වින්සෝලාර්',
      website: 'https://winsolar.lk',
      phone: '+94 11 567 8901',
      address: 'Colombo, Sri Lanka',
      description: 'Affordable solar packages for residential and commercial installations.',
      rating: '4.0',
    },
    {
      name: 'Paradise Solar Energy',
      nameSinhala: 'පැරඩයිස් සෝලාර් එනර්ජි',
      website: 'https://paradisesolarenergy.com',
      phone: '+94 11 678 9012',
      address: 'Colombo, Sri Lanka',
      description: 'Quality solar installations with focus on customer service.',
      rating: '4.2',
    },
  ];

  for (const provider of providers) {
    await connection.execute(
      `INSERT INTO providers (name, nameSinhala, website, phone, address, description, rating) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE website = VALUES(website), rating = VALUES(rating)`,
      [provider.name, provider.nameSinhala, provider.website, provider.phone, provider.address, provider.description, provider.rating]
    );
  }

  // Get provider and hardware IDs
  const [providerRows] = await connection.execute('SELECT id, name FROM providers');
  const providerMap = Object.fromEntries(providerRows.map(p => [p.name, p.id]));

  const [panelRows] = await connection.execute('SELECT id, model FROM solar_panels');
  const panelMap = Object.fromEntries(panelRows.map(p => [p.model, p.id]));

  const [inverterRows] = await connection.execute('SELECT id, model FROM inverters');
  const inverterMap = Object.fromEntries(inverterRows.map(i => [i.model, i.id]));

  // ============ PACKAGES ============
  console.log('Adding solar packages...');
  const packages = [
    {
      providerId: providerMap['Hayleys Solar'],
      name: '5kW Premium On-Grid',
      nameSinhala: '5kW ප්‍රිමියම් ඔන්-ග්‍රිඩ්',
      type: 'on-grid',
      systemCapacity: '5.0',
      panelId: panelMap['Hi-MO 5 LR5-72HPH-550M'],
      panelCount: 9,
      inverterId: inverterMap['SUN2000-5KTL-M1'],
      priceLKR: '1250000',
      warrantyYears: 10,
      description: 'Premium on-grid system with LONGi panels and Huawei inverter.',
      features: JSON.stringify(['Premium components', 'Smart monitoring', '10-year warranty']),
      estimatedMonthlyGeneration: '650',
      roiYears: '4.5',
      hardwareQualityScore: '9.0',
      isFeatured: true,
    },
    {
      providerId: providerMap['Hayleys Solar'],
      name: '5kW Value On-Grid',
      nameSinhala: '5kW වැලිව් ඔන්-ග්‍රිඩ්',
      type: 'on-grid',
      systemCapacity: '5.0',
      panelId: panelMap['JAM72S30-545/MR'],
      panelCount: 9,
      inverterId: inverterMap['MIN 5000TL-X'],
      priceLKR: '850000',
      warrantyYears: 10,
      description: 'Great value on-grid system with JA Solar panels and Growatt inverter.',
      features: JSON.stringify(['Best value', 'Reliable components', 'WiFi monitoring']),
      estimatedMonthlyGeneration: '650',
      roiYears: '3.2',
      hardwareQualityScore: '7.5',
      isFeatured: true,
    },
    {
      providerId: providerMap['JLanka Technologies'],
      name: '5kW Standard Package',
      nameSinhala: '5kW ස්ටෑන්ඩර්ඩ් පැකේජය',
      type: 'on-grid',
      systemCapacity: '5.0',
      panelId: panelMap['Tiger Neo N-type 580W'],
      panelCount: 9,
      inverterId: inverterMap['S6-GR1P5K'],
      priceLKR: '698220',
      warrantyYears: 10,
      description: 'Affordable on-grid package with Jinko panels and Solis inverter.',
      features: JSON.stringify(['Competitive price', 'N-type panels', 'Good support']),
      estimatedMonthlyGeneration: '650',
      roiYears: '2.8',
      hardwareQualityScore: '8.0',
      isFeatured: true,
    },
    {
      providerId: providerMap['JLanka Technologies'],
      name: '3kW Entry Level',
      nameSinhala: '3kW එන්ට්‍රි ලෙවල්',
      type: 'on-grid',
      systemCapacity: '3.0',
      panelId: panelMap['JAM72S30-545/MR'],
      panelCount: 6,
      inverterId: inverterMap['MIN 5000TL-X'],
      priceLKR: '450000',
      warrantyYears: 10,
      description: 'Entry-level system for smaller households.',
      features: JSON.stringify(['Budget friendly', 'Suitable for small homes']),
      estimatedMonthlyGeneration: '390',
      roiYears: '3.5',
      hardwareQualityScore: '7.5',
    },
    {
      providerId: providerMap['WinSolar'],
      name: '5kW Hybrid System',
      nameSinhala: '5kW හයිබ්‍රිඩ් සිස්ටම්',
      type: 'hybrid',
      systemCapacity: '5.0',
      panelId: panelMap['HiKu7 CS7L-595MS'],
      panelCount: 9,
      inverterId: inverterMap['SPH 5000TL BL-UP'],
      priceLKR: '1100000',
      warrantyYears: 10,
      description: 'Hybrid system with battery backup capability.',
      features: JSON.stringify(['Battery ready', 'Backup power', 'Future-proof']),
      estimatedMonthlyGeneration: '650',
      roiYears: '4.0',
      hardwareQualityScore: '7.8',
    },
    {
      providerId: providerMap['Paradise Solar Energy'],
      name: '10kW Commercial',
      nameSinhala: '10kW වාණිජ',
      type: 'on-grid',
      systemCapacity: '10.0',
      panelId: panelMap['Hi-MO 5 LR5-72HPH-550M'],
      panelCount: 18,
      inverterId: inverterMap['SUN2000-5KTL-M1'],
      priceLKR: '2200000',
      warrantyYears: 10,
      description: 'Commercial-grade system for businesses and large homes.',
      features: JSON.stringify(['High capacity', 'Commercial grade', 'Premium components']),
      estimatedMonthlyGeneration: '1300',
      roiYears: '4.2',
      hardwareQualityScore: '9.0',
    },
  ];

  for (const pkg of packages) {
    await connection.execute(
      `INSERT INTO solar_packages (providerId, name, nameSinhala, type, systemCapacity, panelId, panelCount, inverterId, priceLKR, warrantyYears, description, features, estimatedMonthlyGeneration, roiYears, hardwareQualityScore, isFeatured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE priceLKR = VALUES(priceLKR), hardwareQualityScore = VALUES(hardwareQualityScore)`,
      [pkg.providerId, pkg.name, pkg.nameSinhala, pkg.type, pkg.systemCapacity, pkg.panelId, pkg.panelCount, pkg.inverterId, pkg.priceLKR, pkg.warrantyYears, pkg.description, pkg.features, pkg.estimatedMonthlyGeneration, pkg.roiYears, pkg.hardwareQualityScore, pkg.isFeatured || false]
    );
  }

  // ============ CEB TARIFFS ============
  console.log('Adding CEB tariffs...');
  const tariffs = [
    { category: 'domestic', blockNumber: 1, minUnits: 0, maxUnits: 30, energyChargeLKR: '4.00', fixedChargeLKR: '75.00' },
    { category: 'domestic', blockNumber: 2, minUnits: 31, maxUnits: 60, energyChargeLKR: '7.85', fixedChargeLKR: '200.00' },
    { category: 'domestic', blockNumber: 3, minUnits: 61, maxUnits: 90, energyChargeLKR: '10.00', fixedChargeLKR: '400.00' },
    { category: 'domestic', blockNumber: 4, minUnits: 91, maxUnits: 120, energyChargeLKR: '27.75', fixedChargeLKR: '1000.00' },
    { category: 'domestic', blockNumber: 5, minUnits: 121, maxUnits: 180, energyChargeLKR: '32.00', fixedChargeLKR: '1500.00' },
    { category: 'domestic', blockNumber: 6, minUnits: 181, maxUnits: null, energyChargeLKR: '52.00', fixedChargeLKR: '2000.00' },
  ];

  for (const tariff of tariffs) {
    await connection.execute(
      `INSERT INTO ceb_tariffs (category, blockNumber, minUnits, maxUnits, energyChargeLKR, fixedChargeLKR, effectiveFrom) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE energyChargeLKR = VALUES(energyChargeLKR), fixedChargeLKR = VALUES(fixedChargeLKR)`,
      [tariff.category, tariff.blockNumber, tariff.minUnits, tariff.maxUnits, tariff.energyChargeLKR, tariff.fixedChargeLKR]
    );
  }

  console.log('✅ Database seeded successfully!');
  await connection.end();
}

seed().catch(console.error);
