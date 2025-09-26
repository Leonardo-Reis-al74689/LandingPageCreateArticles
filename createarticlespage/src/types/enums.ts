export enum FormFieldType {
  ARTICLE_TYPE = 'articleType',
  CLIENT = 'client',
  COLOR_ASSORTMENT = 'colorAssortment',
  CERTIFICATION = 'certification',
  BRAND = 'brand',
  SIZE = 'size',
  UNIT = 'unit',
  CURRENCY = 'currency',
  SUSTAINABLE_COMP = 'sustainableComp',
  PACK_TYPE = 'packType'
}

export enum FormFieldCodeType {
  ARTICLE_TYPE_CODE = 'articleTypeCode',
  CLIENT_CODE = 'clientCode',
  COLOR_CODE = 'colorCode',
  CERTIFICATION_CODE = 'certificationCode',
  BRAND_CODE = 'brandCode',
  SIZE_CODE = 'sizeCode',
  UNIT_CODE = 'unitCode',
  CURRENCY_CODE = 'currencyCode',
  SUSTAINABLE_CODE = 'sustainableCode',
  PACK_TYPE_CODE = 'packTypeCode'
}

export enum LoadingState {
  INITIAL = 'initial',
  BRANDS = 'brands',
  COLORS = 'colors',
  SIZES = 'sizes'
}

export enum ArticleTypeCode {
  PK = 'PK'
}

export const FIELD_CODE_MAPPING: Record<FormFieldType, FormFieldCodeType> = {
  [FormFieldType.ARTICLE_TYPE]: FormFieldCodeType.ARTICLE_TYPE_CODE,
  [FormFieldType.CLIENT]: FormFieldCodeType.CLIENT_CODE,
  [FormFieldType.COLOR_ASSORTMENT]: FormFieldCodeType.COLOR_CODE,
  [FormFieldType.CERTIFICATION]: FormFieldCodeType.CERTIFICATION_CODE,
  [FormFieldType.BRAND]: FormFieldCodeType.BRAND_CODE,
  [FormFieldType.SIZE]: FormFieldCodeType.SIZE_CODE,
  [FormFieldType.UNIT]: FormFieldCodeType.UNIT_CODE,
  [FormFieldType.CURRENCY]: FormFieldCodeType.CURRENCY_CODE,
  [FormFieldType.SUSTAINABLE_COMP]: FormFieldCodeType.SUSTAINABLE_CODE,
  [FormFieldType.PACK_TYPE]: FormFieldCodeType.PACK_TYPE_CODE
};

export const FIELD_RESET_RULES: Record<FormFieldType, FormFieldType[]> = {
  [FormFieldType.CLIENT]: [
    FormFieldType.BRAND,
    FormFieldType.COLOR_ASSORTMENT,
    FormFieldType.SIZE
  ],
  [FormFieldType.BRAND]: [
    FormFieldType.COLOR_ASSORTMENT,
    FormFieldType.SIZE
  ],
  [FormFieldType.COLOR_ASSORTMENT]: [
    FormFieldType.SIZE
  ],
  [FormFieldType.ARTICLE_TYPE]: [],
  [FormFieldType.CERTIFICATION]: [],
  [FormFieldType.SIZE]: [],
  [FormFieldType.UNIT]: [],
  [FormFieldType.CURRENCY]: [],
  [FormFieldType.SUSTAINABLE_COMP]: [],
  [FormFieldType.PACK_TYPE]: []
};

export type FormFieldTypeKeys = keyof typeof FormFieldType;
export type FormFieldCodeTypeKeys = keyof typeof FormFieldCodeType;
