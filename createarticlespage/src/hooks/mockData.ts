import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const mockData = {
  initialOptions: {
    "success": true,
    "data": ["PM", "PK", "AC", "KS"]
  },

  pkData: {
    "success": true,
    "customer": [
      {"001": "WIP"},
      {"025": "IPCA"}
    ],
    "certification": [
      {"001": "GOTS"},
      {"002": "BLUE"},
      {"003": "GREEN"}
    ],
    "unit": [
      {"001": "UN"},
      {"002": "PK"},
      {"003": "PAIR"}
    ],
    "currency": [
      {"001": "EUR"},
      {"002": "USD"},
      {"003": "JPY"},
      {"004": "GBP"}
    ],
    "sustComp": [
      {"001": "ECO"},
      {"002": "WOOL"},
      {"003": "GRTXT"}
    ]
  },

  brands: {
    "001": { // WIP
      "success": true,
      "data": [
        {"001": "WIPTech Pro"},
        {"253": "WIPTech Ultra"},
        {"563": "WIPTech Standard"}
      ]
    },
    "025": { // IPCA
      "success": true,
      "data": [
        {"009": "IPCA 1"},
        {"632": "IPCA 2"}
      ]
    }
  },

  colors: {
    "001": { // WIPTech Pro
      "success": true,
      "data": [
        {"002": "Pure Red"},
        {"006": "Soft White"},
        {"009": "Sunset Orange"}
      ]
    },
    "253": { // WIPTech Ultra
      "success": true,
      "data": [
        {"025": "Pure Red"},
        {"085": "Soft White"}
      ]
    },
    "563": { // WIPTech Standard
      "success": true,
      "data": [
        {"001": "Black"},
        {"002": "White"}
      ]
    },
    "009": { // IPCA 1
      "success": true,
      "data": [
        {"001": "Green"},
        {"002": "White"}
      ]
    },
    "632": { // IPCA 2
      "success": true,
      "data": [
        {"001": "Green"},
        {"002": "White"}
      ]
    }
  },

  // Tamanhos independentes - sempre de 25 a 60
  sizes: {
    "success": true,
    "data": [
      {"025": "25"},
      {"026": "26"},
      {"027": "27"},
      {"028": "28"},
      {"029": "29"},
      {"030": "30"},
      {"031": "31"},
      {"032": "32"},
      {"033": "33"},
      {"034": "34"},
      {"035": "35"},
      {"036": "36"},
      {"037": "37"},
      {"038": "38"},
      {"039": "39"},
      {"040": "40"},
      {"041": "41"},
      {"042": "42"},
      {"043": "43"},
      {"044": "44"},
      {"045": "45"},
      {"046": "46"},
      {"047": "47"},
      {"048": "48"},
      {"049": "49"},
      {"050": "50"},
      {"051": "51"},
      {"052": "52"},
      {"053": "53"},
      {"054": "54"},
      {"055": "55"},
      {"056": "56"},
      {"057": "57"},
      {"058": "58"},
      {"059": "59"},
      {"060": "60"}
    ]
  }
};

export const setupMocks = () => {
  // 1. API inicial - opções de tipo de artigo
  mock.onGet('/api/initial-options').reply(200, mockData.initialOptions);

  // 2. API após escolher "PK" - dados base
  mock.onGet('/api/article-type/PK').reply(200, mockData.pkData);

  // 3. API de marcas por cliente
  mock.onGet(/\/api\/brands\/\d+/).reply((config) => {
    const customerId = config.url?.split('/').pop();
    if (!customerId) {
      return [400, { success: false, message: 'ID do cliente inválido' }];
    }
    
    const brandData = mockData.brands[customerId as keyof typeof mockData.brands];
    
    if (brandData) {
      return [200, brandData];
    }
    return [404, { success: false, message: 'Cliente não encontrado' }];
  });

  // 4. API de cores por marca
  mock.onGet(/\/api\/colors\/\d+/).reply((config) => {
    const brandId = config.url?.split('/').pop();
    if (!brandId) {
      return [400, { success: false, message: 'ID da marca inválido' }];
    }
    
    const colorData = mockData.colors[brandId as keyof typeof mockData.colors];
    
    if (colorData) {
      return [200, colorData];
    }
    return [404, { success: false, message: 'Marca não encontrada' }];
  });

  // 5. API de tamanhos - independente da cor, sempre retorna tamanhos 25-60
  mock.onGet(/\/api\/sizes\/\d+/).reply(() => {
    return [200, mockData.sizes];
  });

  // 6. API para gravar artigo
  mock.onPost('/api/articles').reply((config) => {
    try {
      const data = JSON.parse(config.data);
      
      if (!data.articleType || !data.client || !data.numberOfPairs) {
        return [400, {
          success: false,
          message: 'Campos obrigatórios em falta: Tipo, Cliente, Número de Pares',
          errors: ['articleType', 'client', 'numberOfPairs']
        }];
      }
      
      const pairs = parseInt(data.numberOfPairs);
      if (isNaN(pairs) || pairs < 1 || pairs > 999) {
        return [400, {
          success: false,
          message: 'Número de pares deve ser entre 1 e 999',
          errors: ['numberOfPairs']
        }];
      }

      const sanitizedData = {
        ...data,
        description: typeof data.description === 'string' ? data.description.slice(0, 500) : '',
        clientRef: typeof data.clientRef === 'string' ? data.clientRef.slice(0, 100) : '',
        csStyleRef: typeof data.csStyleRef === 'string' ? data.csStyleRef.slice(0, 100) : '',
        customerBarcode: typeof data.customerBarcode === 'string' ? data.customerBarcode.slice(0, 50) : ''
      };

      const articleId = `ART-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const savedArticle = {
        id: articleId,
        ...sanitizedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'ativo'
      };

      return [200, {
        success: true,
        message: 'Artigo criado e gravado com sucesso na base de dados',
        id: articleId,
        article: savedArticle
      }];
    } catch (error) {
      return [500, {
        success: false,
        message: 'Erro interno do servidor ao processar dados',
        error: 'INTERNAL_ERROR'
      }];
    }
  });

  // 7. API para verificar/gerar código de artigo
  mock.onPost('/api/articles/verify-code').reply((config) => {
    try {
      const data = JSON.parse(config.data);
    
      const typeCode = data.articleTypeCode || "PK";
      const pairsCode = (data.numberOfPairs || "2").padStart(3, '0');
      const clientCode = data.clientCode || "015";
      const brandCode = data.brandCode || "099";
      const colorCode = data.colorCode || "001";
      const sizeCode = data.sizeCode || "042";
      const certificationCode = data.certificationCode || "01";
    
      const generatedCode = `${typeCode}${pairsCode}${clientCode}${brandCode}${colorCode}${sizeCode}${certificationCode}`;
    
        return [200, {
          success: true,
          message: 'Código verificado e gerado com sucesso',
          code: generatedCode,
          components: {
            type: typeCode,
            pairs: pairsCode,
            client: clientCode,
            brand: brandCode,
            color: colorCode,
            size: sizeCode,
            certification: certificationCode
          },
          isValid: true,
          exists: false 
        }];
      } catch (error) {
        return [500, {
          success: false,
          message: 'Erro interno do servidor ao gerar código',
          error: 'INTERNAL_ERROR'
        }];
      }
    });
  };

// Funções helper para usar nos componentes
export const apiService = {
  
  getInitialOptions: async () => {
    const response = await axios.get('/api/initial-options');
    return response.data;
  },

  getArticleTypeData: async (type: string) => {
    const response = await axios.get(`/api/article-type/${type}`);
    return response.data;
  },

  getBrandsByCustomer: async (customerId: string) => {
    const response = await axios.get(`/api/brands/${customerId}`);
    return response.data;
  },

  getColorsByBrand: async (brandId: string) => {
    const response = await axios.get(`/api/colors/${brandId}`);
    return response.data;
  },

  getSizesByColor: async (colorId: string) => {
    const response = await axios.get(`/api/sizes/${colorId}`);
    return response.data;
  },

  saveArticle: async (articleData: any) => {
    const response = await axios.post('/api/articles', articleData);
    return response.data;
  },

  verifyCode: async (articleData: any) => {
    const response = await axios.post('/api/articles/verify-code', articleData);
    return response.data;
  }
};

export const formatDataForDropdown = (apiData: any[]) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  return apiData
    .filter(item => item && typeof item === 'object')
    .map(item => {
      const code = Object.keys(item)[0];
      const name = Object.values(item)[0] as string;
      
      if (!code || !name || typeof name !== 'string') {
        return null;
      }
      
      return { 
        code: String(code).slice(0, 10),
        name: String(name).slice(0, 100),
        value: String(code).slice(0, 10),
        label: String(name).slice(0, 100)
      };
    })
    .filter(Boolean);
};