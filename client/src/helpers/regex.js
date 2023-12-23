export const REGEX_EMAIL = new RegExp(`^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`);
export const REGEX_PHONE = new RegExp(`^0\\d{9}$`);
export const REGEX_PASSWORD = new RegExp(
  `^(?=.*\\d)(?=.*[A-z])[\\w~@#$%^&*+=|{}:;!.?\\"()\\[\\]-]+$`
);
