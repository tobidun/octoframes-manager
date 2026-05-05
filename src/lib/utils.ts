import { CURRENCIES } from "./constants";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const today = () => new Date().toISOString().split("T")[0];

export const curSym = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "£";

export const fmtMoney = (amt: number | string, code: string = "GBP") => {
  const value = typeof amt === "string" ? parseFloat(amt || "0") : amt;
  return `${curSym(code)}${value.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
