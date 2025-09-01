import { useState, useCallback } from 'react';
import { apiService, formatDataForDropdown } from '@/hooks/mockData';
import { toast } from 'sonner';

export interface DropdownOption {
  code: string;
  name: string;
  value: string;
  label: string;
}

export interface LoadingState {
  initial: boolean;
  brands: boolean;
  colors: boolean;
  sizes: boolean;
}

export const useDropdownData = () => {
  const [articleTypeOptions, setArticleTypeOptions] = useState<DropdownOption[]>([]);
  const [clientOptions, setClientOptions] = useState<DropdownOption[]>([]);
  const [certificationOptions, setCertificationOptions] = useState<DropdownOption[]>([]);
  const [unitOptions, setUnitOptions] = useState<DropdownOption[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<DropdownOption[]>([]);
  const [sustainableOptions, setSustainableOptions] = useState<DropdownOption[]>([]);
  const [brandOptions, setBrandOptions] = useState<DropdownOption[]>([]);
  const [colorOptions, setColorOptions] = useState<DropdownOption[]>([]);
  const [sizeOptions, setSizeOptions] = useState<DropdownOption[]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    brands: false,
    colors: false,
    sizes: false,
  });

  const [isPKSelected, setIsPKSelected] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }));

      await new Promise(resolve => setTimeout(resolve, 100));

      const initialOptions = await apiService.getInitialOptions();
      
      if (initialOptions.success) {
        const formattedTypes = initialOptions.data.map((type: string) => ({
          code: type,
          name: type,
          value: type,
          label: type
        }));
        setArticleTypeOptions(formattedTypes);
      }
    } catch {
      toast.error("Erro ao carregar dados iniciais", {
        description: "Por favor, recarregue a página e tente novamente."
      });
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, []);

  const loadPKData = useCallback(async () => {
    try {
      const pkData = await apiService.getArticleTypeData("PK");
      if (pkData.success) {
        setClientOptions(formatDataForDropdown(pkData.customer) as DropdownOption[]);
        setCertificationOptions(formatDataForDropdown(pkData.certification) as DropdownOption[]);
        setUnitOptions(formatDataForDropdown(pkData.unit) as DropdownOption[]);
        setCurrencyOptions(formatDataForDropdown(pkData.currency) as DropdownOption[]);
        setSustainableOptions(formatDataForDropdown(pkData.sustComp) as DropdownOption[]);
      }
    } catch {
      toast.error("Erro ao carregar dados PK", {
        description: "Por favor, tente selecionar novamente."
      });
    }
  }, []);

  const loadBrands = useCallback(async (clientCode: string) => {
    if (!clientCode) {
      setBrandOptions([]);
      setColorOptions([]);
      setSizeOptions([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, brands: true }));
      const brandsData = await apiService.getBrandsByCustomer(clientCode);
      if (brandsData.success) {
        setBrandOptions(formatDataForDropdown(brandsData.data) as DropdownOption[]);
      }
    } catch {
      toast.error("Erro ao carregar marcas", {
        description: "Verifique a conexão e tente novamente."
      });
      setBrandOptions([]);
    } finally {
      setLoading(prev => ({ ...prev, brands: false }));
    }
  }, []);

  const loadColors = useCallback(async (brandCode: string) => {
    if (!brandCode) {
      setColorOptions([]);
      setSizeOptions([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, colors: true }));
      const colorsData = await apiService.getColorsByBrand(brandCode);
      if (colorsData.success) {
        setColorOptions(formatDataForDropdown(colorsData.data) as DropdownOption[]);
      }
    } catch {
      toast.error("Erro ao carregar cores", {
        description: "Verifique a conexão e tente novamente."
      });
      setColorOptions([]);
    } finally {
      setLoading(prev => ({ ...prev, colors: false }));
    }
  }, []);

  const loadSizes = useCallback(async (colorCode: string) => {
    if (!colorCode) {
      setSizeOptions([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, sizes: true }));
      const sizesData = await apiService.getSizesByColor(colorCode);
      
      if (sizesData.success && sizesData.data) {
        const formattedSizes = formatDataForDropdown(sizesData.data) as DropdownOption[];
        setSizeOptions(formattedSizes);
      }
    } catch {
      toast.error("Erro ao carregar tamanhos", {
        description: "Verifique a conexão e tente novamente."
      });
      setSizeOptions([]);
    } finally {
      setLoading(prev => ({ ...prev, sizes: false }));
    }
  }, []);

  const resetPKData = useCallback(() => {
    setClientOptions([]);
    setCertificationOptions([]);
    setUnitOptions([]);
    setCurrencyOptions([]);
    setSustainableOptions([]);
    setBrandOptions([]);
    setColorOptions([]);
    setSizeOptions([]);
    setIsPKSelected(false);
  }, []);

  const resetAllData = useCallback(() => {
    resetPKData();
    setArticleTypeOptions([]);
  }, [resetPKData]);

  return {
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
    resetPKData,
    resetAllData
  };
};
