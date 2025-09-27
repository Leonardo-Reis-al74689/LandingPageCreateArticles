"use client"

import * as React from "react"
import { useCallback, useMemo } from "react"

import { LuChevronDown } from "react-icons/lu"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { toast } from "sonner"

import { apiService } from "@/hooks/mockData"
import { useFormData, type ArticleFormData } from "@/hooks/useFormData"
import { useDropdownData, type DropdownOption } from "@/hooks/useDropdownData"
import { FormField } from "@/components/FormField"
import { Separator } from "./ui/separator"
import { useApiDebounce } from "@/hooks/useDebounce"
import { 
  FormFieldType, 
  FIELD_CODE_MAPPING, 
  FIELD_RESET_RULES, 
  ArticleTypeCode,
  LoadingState 
} from "@/types/enums"

export function SectionCards() {
  const { formData, updateField, updateMultipleFields, resetForm, validateRequired } = useFormData();
  const {
    articleTypeOptions,
    clientOptions,
    certificationOptions,
    unitOptions,
    currencyOptions,
    sustainableOptions,
    brandOptions,
    colorOptions,
    sizeOptions,
    loading,
    isPKSelected,
    setIsPKSelected,
    loadInitialData,
    loadPKData,
    loadBrands,
    loadColors,
    loadSizes,
    resetPKData
  } = useDropdownData();
  
  const [dropdownInputs, setDropdownInputs] = React.useState<Record<string, string>>({});
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const packTypeOptions = useMemo(() => [
    { label: "Packs de Meias / Packs Assortment Socks", value: "packs_meias", code: "001", name: "Packs de Meias" },
  ], []);

  const handleDropdownSelect = React.useCallback(async (fieldName: keyof ArticleFormData, option: DropdownOption) => {
    const fieldTypeEnum = fieldName as FormFieldType;
    const codeFieldName = FIELD_CODE_MAPPING[fieldTypeEnum] as keyof ArticleFormData;
    
    const updates: Partial<ArticleFormData> = {};
    updates[fieldName] = option.label;
    updates[codeFieldName] = option.code;

    if (fieldName === FormFieldType.ARTICLE_TYPE && option.code === ArticleTypeCode.PK) {
      setIsPKSelected(true);
      loadPKData();
    } else if (fieldName === FormFieldType.ARTICLE_TYPE && option.code !== ArticleTypeCode.PK) {
      resetPKData();
    }

    const fieldsToReset = FIELD_RESET_RULES[fieldTypeEnum];
    if (fieldsToReset) {
      fieldsToReset.forEach(fieldToReset => {
        const fieldKey = fieldToReset as keyof ArticleFormData;
        const codeFieldKey = FIELD_CODE_MAPPING[fieldToReset] as keyof ArticleFormData;
        updates[fieldKey] = "";
        updates[codeFieldKey] = "";
      });
    }
    
    updateMultipleFields(updates);
  }, [loadPKData, resetPKData, updateMultipleFields, setIsPKSelected]);

  React.useEffect(() => {
    const timer = setTimeout(loadInitialData, 200);
    return () => clearTimeout(timer);
  }, [loadInitialData]);

  React.useEffect(() => {
    if (!formData.packType && packTypeOptions.length > 0) {
      const defaultPackOption = packTypeOptions[0];
      handleDropdownSelect('packType', defaultPackOption);
    }
  }, [formData.packType, packTypeOptions, handleDropdownSelect]);

  React.useEffect(() => {
    loadBrands(formData.clientCode);
  }, [formData.clientCode, loadBrands]);

  React.useEffect(() => {
    loadColors(formData.brandCode);
  }, [formData.brandCode, loadColors]);

  React.useEffect(() => {
    loadSizes(formData.colorCode);
  }, [formData.colorCode, loadSizes]);

  const createDropdown = (
    fieldName: keyof ArticleFormData,
    options: DropdownOption[],
    placeholder: string,
    className: string = "w-full",
    isLoading: boolean = false
  ) => {
    const dropdownKey = fieldName;
    const isOpen = openDropdowns[dropdownKey] || false;
    
    const filteredOptions = options.filter(opt =>
      opt.label.toLowerCase().includes((dropdownInputs[dropdownKey] || "").toLowerCase())
    );

    const handleOpenChange = (open: boolean) => {
      setOpenDropdowns(prev => ({ ...prev, [dropdownKey]: open }));
      if (!open) {
        setDropdownInputs(prev => ({ ...prev, [dropdownKey]: "" }));
      }
    };

    const handleOptionSelect = (option: DropdownOption) => {
      handleDropdownSelect(fieldName, option);
      setDropdownInputs(prev => ({ ...prev, [dropdownKey]: "" }));
      setOpenDropdowns(prev => ({ ...prev, [dropdownKey]: false }));
    };

  return (
          <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
              <DropdownMenuTrigger asChild>
          <button 
            type="button" 
            className={`flex items-center justify-between gap-2 p-2 rounded border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            <span className="flex-1 text-left truncate text-sm">
              {formData[fieldName] || (isLoading ? "A carregar..." : placeholder)}
            </span>
            <LuChevronDown className="text-gray-500 flex-shrink-0" size={16} />
                </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-56 overflow-y-auto">
              <div className="px-2 pt-2 pb-1">
                <input
                  type="text"
                  className="w-full rounded border px-2 py-1 text-sm outline-none focus:ring"
                  placeholder="Filtrar..."
              value={dropdownInputs[dropdownKey] || ""}
              onChange={e => setDropdownInputs(prev => ({ ...prev, [dropdownKey]: e.target.value }))}
              onKeyDown={e => e.stopPropagation()}
              onKeyPress={e => e.stopPropagation()}
              onKeyUp={e => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <DropdownMenuSeparator />
              {filteredOptions.length === 0 ? (
            <div className="px-2 py-2 text-sm text-muted-foreground">
              {isLoading ? "A carregar..." : "Nenhuma opção encontrada"}
            </div>
              ) : (
                filteredOptions.map(opt => (
              <div
                key={opt.code}
                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-muted rounded"
                onClick={() => handleOptionSelect(opt)}
                  >
                    {opt.label}
              </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
    );
  };


  const numericFields = useMemo(() => [
    'numberOfPairs', 'packsPerBox', 'coefficientPerBox', 'unitPrice', 
    'weight', 'boxWeight', 'boxWidth', 'boxHeight', 'boxDepth'
  ], []);
  
  const handleInputChange = useCallback((field: keyof ArticleFormData, value: string) => {
    if (numericFields.includes(field)) {
      if (field === 'numberOfPairs') {
        const numValue = parseInt(value) || 0;
        if (numValue > 999) {
          value = "999";
        } else if (value && !/^\d+$/.test(value)) {
          return; 
        }
      }
      else if (field === 'coefficientPerBox') {
        if (value && !/^\d*\.?\d{0,8}$/.test(value)) {
          return;
        }
      }
      else if (value && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }
    
    if (typeof value === 'string') {
      const maxLengths: Record<string, number> = {
        description: 500,
        clientRef: 100,
        csStyleRef: 100,
        customerBarcode: 50
      };
      
      const maxLength = maxLengths[field] || 255;
      if (value.length > maxLength) {
        value = value.slice(0, maxLength);
      }
    }
    
    updateField(field, value);
  }, [numericFields, updateField]);

  const handleVerifyInternal = async () => {
    const validation = validateRequired();
    if (!validation.isValid) {
      toast.error("Campos obrigatórios em falta", {
        description: `Por favor, preencha: ${validation.missingFields.join(', ')}`,
        duration: 5000,
      });
      return;
    }
    
    if (!formData.brand || !formData.colorAssortment || !formData.size || !formData.certification) {
      toast.error("Campos adicionais necessários", {
        description: "Por favor, preencha: Marca, Cor, Tamanho e Certificação antes de verificar.",
        duration: 5000,
      });
      return;
    }

    try {
      setIsVerifying(true);
      const result = await apiService.verifyCode(formData as unknown as Record<string, unknown>);
      
      if (result.success) {
        updateField('newCodeGenerated', result.code);

        
        const components = result.components || {};
        
        const detailedDescription = `
${result.code}

${components.pairs || '0'} Pares
Cliente ${components.client || '000'}
Marca ${components.brand || '000'}
Cor ${components.color || '000'}
Tamanho ${components.size || '000'}
Certificação ${components.certification || '00'}
        `.trim();

        toast.success("✅ Código verificado com sucesso!", {
          description: detailedDescription,
          duration: 15000,
          action: {
            label: "Copiar Código",
            onClick: () => {
              navigator.clipboard.writeText(result.code);
              toast.success("Código copiado para a área de transferência!");
            }
          }
        });
      }
    } catch {
      toast.error("Erro ao verificar código", {
        description: "Por favor, tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const { debouncedApiCall: handleVerify } = useApiDebounce(handleVerifyInternal, 500);

  const handleSaveInternal = async () => {
    try {
      const validation = validateRequired();
      if (!validation.isValid) {
        toast.error(`Por favor, preencha os campos obrigatórios: ${validation.missingFields.join(', ')}`);
        return;
      }

      setIsSaving(true);

      const articleData = {
        articleType: formData.articleType,
        articleTypeCode: formData.articleTypeCode,
        packType: formData.packType,
        numberOfPairs: formData.numberOfPairs,
        client: formData.client,
        clientCode: formData.clientCode,
        colorAssortment: formData.colorAssortment,
        colorCode: formData.colorCode,
        certification: formData.certification,
        certificationCode: formData.certificationCode,
        brand: formData.brand,
        brandCode: formData.brandCode,
        size: formData.size,
        sizeCode: formData.sizeCode,
        unitPrice: formData.unitPrice,
        unit: formData.unit,
        unitCode: formData.unitCode,
        currency: formData.currency,
        currencyCode: formData.currencyCode,
        sustainableComp: formData.sustainableComp,
        sustainableCode: formData.sustainableCode,
        weight: formData.weight,
        boxWeight: formData.boxWeight,
        boxWidth: formData.boxWidth,
        boxHeight: formData.boxHeight,
        boxDepth: formData.boxDepth,
        packsPerBox: formData.packsPerBox,
        coefficientPerBox: formData.coefficientPerBox,
        newCodeGenerated: formData.newCodeGenerated,
        description: formData.description,
        clientRef: formData.clientRef,
        csStyleRef: formData.csStyleRef,
        customerBarcode: formData.customerBarcode,
        timestamp: new Date().toISOString(),
        status: 'ativo'
      };

      const result = await apiService.saveArticle(articleData);

      if (result.success) {

        const saveArticleToJson = {
          tipo: formData.articleType,
          cliente: formData.client,
          marca: formData.brand || 'Não especificado',
          cor: formData.colorAssortment || 'Não especificado',
          tamanho: formData.size || 'Não especificado',
          numeroPares: formData.numberOfPairs,
          certificacao: formData.certification || 'Não especificado',
          codigo: formData.newCodeGenerated || 'Não gerado',
        };
        const savedArticles = JSON.parse(localStorage.getItem("artigos") || "[]");
        savedArticles.push(saveArticleToJson);
        localStorage.setItem("artigos", JSON.stringify(savedArticles));

        const detailedInfo = `
Tipo: ${formData.articleType}
Cliente: ${formData.client}
Marca: ${formData.brand || 'Não especificado'}
Cor: ${formData.colorAssortment || 'Não especificado'}
Tamanho: ${formData.size || 'Não especificado'}
Nº Pares: ${formData.numberOfPairs}
Certificação: ${formData.certification || 'Não especificado'}
Código: ${formData.newCodeGenerated || 'Não gerado'}
        `.trim();

        toast.success("✅ Artigo gravado com sucesso!", {
          description: detailedInfo,
          duration: 10000,
          action: {
            label: "Novo Artigo",
            onClick: () => handleResetForm()
          }
        });
      }
    } catch {
      toast.error("Erro ao gravar artigo", {
        description: "Por favor, verifique os dados e tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const { debouncedApiCall: handleSave } = useApiDebounce(handleSaveInternal, 500);

  const handleResetForm = useCallback(() => {
    resetForm();
    setDropdownInputs({});
    setOpenDropdowns({});
    resetPKData();
  }, [resetForm, resetPKData]);

  return (
    <div className="space-y-6">

      {/* Formulário Principal */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Dados do Artigo
            </CardTitle>
            </CardHeader>
        <CardContent className="space-y-6">
          {/* Primeira linha */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                Tipo / Kind
              </label>
              {createDropdown("articleType", articleTypeOptions, "Selecionar tipo...", "w-full", loading[LoadingState.INITIAL])}
            </div>
            <div className="space-y-2 md:col-span-7">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                Packs de Meias / Packs Assortment Socks
              </label>
              {createDropdown("packType", packTypeOptions, "Selecionar tipo de pack...", "w-full")}
            </div>
          </div>

          {/* Campos específicos do PK - só aparecem quando PK é selecionado */}
          {isPKSelected && (
            <>
              {/* Segunda linha */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nº Pares / Nr. Pairs
                  </label>
                  <Input
                    value={formData.numberOfPairs}
                    onChange={e => handleInputChange("numberOfPairs", e.target.value)}
                    className="w-full"
                    placeholder="0"
                    type="number"
                    min="0"
                    max="999"
                  />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-end">
                    Cliente / Customer
                  </label>
                  {createDropdown("client", clientOptions, "Selecionar cliente...", "w-full", loading[LoadingState.INITIAL])}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Packs p/Cx. / Packs per Box
                  </label>
                  <Input
                    value={formData.packsPerBox || "0"}
                    onChange={e => handleInputChange("packsPerBox", e.target.value)}
                    onFocus={e => {
                      if (e.target.value === "0" && !formData.packsPerBox) {
                        e.target.select();
                      }
                    }}
                    className="w-full"
                    placeholder="0"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Coeficiente p/Cx. / Coefficient per Box
                  </label>
                  <Input
                    value={formData.coefficientPerBox || "0"}
                    onChange={e => handleInputChange("coefficientPerBox", e.target.value)}
                    onFocus={e => {
                      if (e.target.value === "0" && !formData.coefficientPerBox) {
                        e.target.select();
                      }
                    }}
                    className="w-full"
                    placeholder="0,00000000"
                    type="number"
                    step="0.00000001"
                    min="0"
                  />
                </div>
              </div>

              {/* Terceira linha */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                    Cor - Sortimento / Color - Assortment
                  </label>
                  {createDropdown("colorAssortment", colorOptions, colorOptions.length > 0 ? "Selecionar cor..." : "Primeiro selecione uma marca", "w-full", loading[LoadingState.COLORS])}
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                    Marca / Brand
                  </label>
                  {createDropdown("brand", brandOptions, brandOptions.length > 0 ? "Selecionar marca..." : "Primeiro selecione um cliente", "w-full", loading[LoadingState.BRANDS])}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                    Tamanho / Size
                  </label>
                  {createDropdown("size", sizeOptions, sizeOptions.length > 0 ? "Selecionar tamanho..." : "Primeiro selecione uma cor", "w-full", loading[LoadingState.SIZES])}
                </div>
              </div>

              {/* Quarta linha - Só Certificação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                    Certificação / Certification
                  </label>
                  {createDropdown("certification", certificationOptions, "Selecionar certificação...", "w-full", loading[LoadingState.INITIAL])}
                </div>
              </div>

              <Separator />

              {/* Quinta linha - Descrição */}
              <FormField
                label="Designação/Description"
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                type="textarea"
                placeholder="Inserir descrição..."
                maxLength={500}
              />

              {/* Sexta linha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Ref. Cliente/Customer ref"
                  value={formData.clientRef}
                  onChange={(value) => handleInputChange("clientRef", value)}
                  maxLength={100}
                />
                <FormField
                  label="CS Style ref"
                  value={formData.csStyleRef}
                  onChange={(value) => handleInputChange("csStyleRef", value)}
                  maxLength={100}
                />
              </div>

              {/* Sétima linha */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="md:col-span-3">
                  <FormField
                    label="Customer Barcode EAN13"
                    value={formData.customerBarcode}
                    onChange={(value) => handleInputChange("customerBarcode", value)}
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Peso/Weight - PK
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.weight || "0"}
                      onChange={e => handleInputChange("weight", e.target.value)}
                      onFocus={e => {
                        if (e.target.value === "0" && !formData.weight) {
                          e.target.select();
                        }
                      }}
                      className="flex-1"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400 px-2">
                      Gr
                    </span>
                  </div>
                </div>
                  <div className="space-y-1 md:col-span-3">
                   <div className="flex flex-wrap gap-2 items-end">
                     <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-end">Un/Unit</label>
                       <div className="w-16">
                         {createDropdown("unit", unitOptions, "Un", "w-full", loading[LoadingState.INITIAL])}
                       </div>
                     </div>
                     <div className="flex-1 min-w-[100px]">
                        <Input
                         value={formData.unitPrice || "0"}
                         onChange={e => handleInputChange("unitPrice", e.target.value)}
                         onFocus={e => {
                           if (e.target.value === "0" && !formData.unitPrice) {
                             e.target.select();
                           }
                         }}
                         className="w-full"
                         type="number"
                         min="0"
                         step="0.01"
                       />
                     </div>
                     <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-end">Moeda/Currency</label>
                       <div className="w-20">
                         {createDropdown("currency", currencyOptions, "EUR", "w-full", loading[LoadingState.INITIAL])}
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Sustainable Comp. depois do separador */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 min-h-[2.5rem] flex items-end">
                    Sustainable Comp.
                  </label>
                  {createDropdown("sustainableComp", sustainableOptions, "Selecionar...", "w-full", loading[LoadingState.INITIAL])}
                </div>
              </div>

              {/* Oitava linha - Medidas */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Peso Cx/Box Weight
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.boxWeight || "0"}
                      onChange={e => handleInputChange("boxWeight", e.target.value)}
                      onFocus={e => {
                        if (e.target.value === "0" && !formData.boxWeight) {
                          e.target.select();
                        }
                      }}
                      className="flex-1"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400 px-2">
                      kg
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-6">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Medidas Cx/Box Measures
                  </label>
                  <div className="flex gap-1 items-center">
                    <Input
                      value={formData.boxWidth || "0"}
                      onChange={e => handleInputChange("boxWidth", e.target.value)}
                      onFocus={e => {
                        if (e.target.value === "0" && !formData.boxWidth) {
                          e.target.select();
                        }
                      }}
                      className="w-20"
                      placeholder="L"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs">x</span>
                    <Input
                      value={formData.boxHeight || "0"}
                      onChange={e => handleInputChange("boxHeight", e.target.value)}
                      onFocus={e => {
                        if (e.target.value === "0" && !formData.boxHeight) {
                          e.target.select();
                        }
                      }}
                      className="w-20"
                      placeholder="A"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs">x</span>
                    <Input
                      value={formData.boxDepth || "0"}
                      onChange={e => handleInputChange("boxDepth", e.target.value)}
                      onFocus={e => {
                        if (e.target.value === "0" && !formData.boxDepth) {
                          e.target.select();
                        }
                      }}
                      className="w-20"
                      placeholder="P"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">cm</span>
                  </div>
                </div>
              </div>

              {/* Nova linha - Código Gerado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    label="Código Gerado/New Code Created"
                    value={formData.newCodeGenerated}
                    onChange={(value) => handleInputChange("newCodeGenerated", value)}
                    placeholder="Código será gerado automaticamente"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleVerify}
                    variant="outline"
                    className="w-full"
                    disabled={!isPKSelected || isVerifying}
                  >
                    {isVerifying ? "A verificar..." : "Verificar/Verify"}
                  </Button>
            </div>
            </div>
            </>
          )}
        </CardContent>
        </Card>

      {/* Botões de Ação */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={handleResetForm}
          variant="outline"
          className="px-6"
        >
          Limpar Formulário
        </Button>
        <Button 
          onClick={handleSave}
          className="px-8"
          disabled={!isPKSelected || isSaving}
        >
          {isSaving ? "A gravar..." : "Gravar"}
        </Button>
            </div>
    </div>
  )
}
