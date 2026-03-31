export const ARGENTINA_PHONE_PREFIX = "+54";
export const ARGENTINA_PHONE_PLACEHOLDER = "+54 9 11 1234-5678";
export const MANAGED_USER_WEIGHT_MIN = 20;
export const MANAGED_USER_WEIGHT_MAX = 150;

const allowedPhoneCharsRegex = /^[\d\s()+-]+$/;
const disallowedPhoneCharsRegex = /[^\d\s()+-]/g;
const areaCodeLengths = [2, 3, 4] as const;

const removeMobileToken = (digits: string): string | null => {
  for (const areaLength of areaCodeLengths) {
    if (
      digits.length === 12 &&
      digits.slice(areaLength, areaLength + 2) === "15"
    ) {
      const nationalNumber =
        digits.slice(0, areaLength) + digits.slice(areaLength + 2);

      if (nationalNumber.length === 10) {
        return nationalNumber;
      }
    }
  }

  return null;
};

export const normalizeArgentinaPhone = (value?: string | null): string | null => {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return null;
  }

  if (!allowedPhoneCharsRegex.test(trimmedValue)) {
    return null;
  }

  let digits = trimmedValue.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("54")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("9") && digits.length === 11) {
    return `+54${digits}`;
  }

  const mobileWithoutToken = removeMobileToken(digits);
  if (mobileWithoutToken) {
    return `+549${mobileWithoutToken}`;
  }

  if (digits.length === 10) {
    return `+549${digits}`;
  }

  return null;
};

export const isEmptyArgentinaPhoneInput = (value?: string | null): boolean => {
  const trimmedValue = value?.trim() ?? "";

  return trimmedValue === "";
};

export const sanitizeArgentinaPhoneInput = (value?: string | null): string => {
  const cleanedValue = (value ?? "").replace(disallowedPhoneCharsRegex, "");

  if (!cleanedValue) {
    return "";
  }

  const normalizedPlus = cleanedValue.startsWith("+")
    ? `+${cleanedValue.slice(1).replace(/\+/g, "")}`
    : cleanedValue.replace(/\+/g, "");

  return normalizedPlus;
};

export const getArgentinaPhoneInputValue = (value?: string | null): string => {
  if (!value?.trim()) {
    return "";
  }

  return normalizeArgentinaPhone(value) ?? sanitizeArgentinaPhoneInput(value);
};
