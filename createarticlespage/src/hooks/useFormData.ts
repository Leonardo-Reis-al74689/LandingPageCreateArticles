import { useState, useCallback } from 'react';
import { FormFieldType } from '@/types/enums';

export interface ArticleFormData {
  articleType: string;
  articleTypeCode: string;
  packType: string;
  numberOfPairs: string;
  client: string;
  clientCode: string;
  colorAssortment: string;
  colorCode: string;
  certification: string;
  certificationCode: string;
  description: string;
  clientRef: string;
  csStyleRef: string;
  customerBarcode: string;
  packsPerBox: string;
  coefficientPerBox: string;
  brand: string;
  brandCode: string;
  size: string;
  sizeCode: string;
  unitPrice: string;
  unit: string;
  unitCode: string;
  currency: string;
  currencyCode: string;
  sustainableComp: string;
  sustainableCode: string;
  weight: string;
  boxWeight: string;
  boxWidth: string;
  boxHeight: string;
  boxDepth: string;
  newCodeGenerated: string;
}

export type FormFieldKeyMapping = {
  [FormFieldType.ARTICLE_TYPE]: 'articleType';
  [FormFieldType.CLIENT]: 'client';
  [FormFieldType.COLOR_ASSORTMENT]: 'colorAssortment';
  [FormFieldType.CERTIFICATION]: 'certification';
  [FormFieldType.BRAND]: 'brand';
  [FormFieldType.SIZE]: 'size';
  [FormFieldType.UNIT]: 'unit';
  [FormFieldType.CURRENCY]: 'currency';
  [FormFieldType.SUSTAINABLE_COMP]: 'sustainableComp';
  [FormFieldType.PACK_TYPE]: 'packType';
};

const initialFormData: ArticleFormData = {
  articleType: "",
  articleTypeCode: "",
  packType: "",
  numberOfPairs: "",
  client: "",
  clientCode: "",
  colorAssortment: "",
  colorCode: "",
  certification: "",
  certificationCode: "",
  description: "",
  clientRef: "",
  csStyleRef: "",
  customerBarcode: "",
  packsPerBox: "",
  coefficientPerBox: "",
  brand: "",
  brandCode: "",
  size: "",
  sizeCode: "",
  unitPrice: "",
  unit: "",
  unitCode: "",
  currency: "",
  currencyCode: "",
  sustainableComp: "",
  sustainableCode: "",
  weight: "",
  boxWeight: "",
  boxWidth: "",
  boxHeight: "",
  boxDepth: "",
  newCodeGenerated: "",
};

export const useFormData = () => {
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);

  const updateField = useCallback((field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<ArticleFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const validateRequired = useCallback(() => {
    const requiredFields = [
      { field: 'articleType', label: 'Tipo / Kind' },
      { field: 'client', label: 'Cliente / Customer' },
      { field: 'numberOfPairs', label: 'Nº Pares / Nr. Pairs' }
    ];

    const missingFields = requiredFields.filter(req => !formData[req.field as keyof ArticleFormData]);
    
    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields.map(f => f.label)
    };
  }, [formData]);

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    validateRequired
  };
};
