
// Security validation utilities for healthcare data
export const validateMedication = (medication: any): string[] => {
  const errors: string[] = [];
  
  if (!medication.drug_name || medication.drug_name.trim().length === 0) {
    errors.push('Drug name is required');
  }
  
  if (medication.drug_name && medication.drug_name.length > 200) {
    errors.push('Drug name must be less than 200 characters');
  }
  
  if (!medication.dosage || medication.dosage.trim().length === 0) {
    errors.push('Dosage is required');
  }
  
  if (medication.dosage && medication.dosage.length > 100) {
    errors.push('Dosage must be less than 100 characters');
  }
  
  if (!medication.frequency || medication.frequency.trim().length === 0) {
    errors.push('Frequency is required');
  }
  
  return errors;
};

export const validateVitalSigns = (vitals: any): string[] => {
  const errors: string[] = [];
  
  if (vitals.heart_rate !== undefined && vitals.heart_rate !== null) {
    if (vitals.heart_rate < 30 || vitals.heart_rate > 220) {
      errors.push('Heart rate must be between 30 and 220 bpm');
    }
  }
  
  if (vitals.blood_pressure_systolic !== undefined && vitals.blood_pressure_systolic !== null) {
    if (vitals.blood_pressure_systolic < 70 || vitals.blood_pressure_systolic > 250) {
      errors.push('Systolic blood pressure must be between 70 and 250 mmHg');
    }
  }
  
  if (vitals.blood_pressure_diastolic !== undefined && vitals.blood_pressure_diastolic !== null) {
    if (vitals.blood_pressure_diastolic < 40 || vitals.blood_pressure_diastolic > 150) {
      errors.push('Diastolic blood pressure must be between 40 and 150 mmHg');
    }
  }
  
  if (vitals.temperature !== undefined && vitals.temperature !== null) {
    if (vitals.temperature < 32 || vitals.temperature > 45) {
      errors.push('Temperature must be between 32°C and 45°C');
    }
  }
  
  if (vitals.oxygen_saturation !== undefined && vitals.oxygen_saturation !== null) {
    if (vitals.oxygen_saturation < 70 || vitals.oxygen_saturation > 100) {
      errors.push('Oxygen saturation must be between 70% and 100%');
    }
  }
  
  return errors;
};

export const validateResident = (resident: any): string[] => {
  const errors: string[] = [];
  
  if (!resident.name || resident.name.trim().length === 0) {
    errors.push('Resident name is required');
  }
  
  if (resident.name && resident.name.length > 255) {
    errors.push('Resident name must be less than 255 characters');
  }
  
  if (resident.age !== undefined && resident.age !== null) {
    if (resident.age < 0 || resident.age > 150) {
      errors.push('Age must be between 0 and 150');
    }
  }
  
  if (resident.room && resident.room.length > 20) {
    errors.push('Room number must be less than 20 characters');
  }
  
  return errors;
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters and limit length
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 1000);
};

export const validateCareReport = (report: any): string[] => {
  const errors: string[] = [];
  
  if (!report.resident_id) {
    errors.push('Resident ID is required');
  }
  
  if (report.physical_condition && report.physical_condition.length > 1000) {
    errors.push('Physical condition notes must be less than 1000 characters');
  }
  
  if (report.special_notes && report.special_notes.length > 2000) {
    errors.push('Special notes must be less than 2000 characters');
  }
  
  return errors;
};
