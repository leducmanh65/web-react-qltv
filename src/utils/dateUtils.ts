export function formatDateArray(arr: any): string {
  try {
    if (!arr) return "";
    if (Array.isArray(arr)) {
      const [y, m, d, hh = 0, mm = 0] = arr;
      const month = String(m).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const hour = String(hh).padStart(2, '0');
      const minute = String(mm).padStart(2, '0');
      return `${y}-${month}-${day} ${hour}:${minute}`;
    }
    // If it's already a string or Date-like
    const dObj = new Date(arr);
    if (!isNaN(dObj.getTime())) {
      const yy = dObj.getFullYear();
      const mmn = String(dObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dObj.getDate()).padStart(2, '0');
      const hh = String(dObj.getHours()).padStart(2, '0');
      const min = String(dObj.getMinutes()).padStart(2, '0');
      return `${yy}-${mmn}-${dd} ${hh}:${min}`;
    }
    return String(arr);
  } catch (e) {
    return String(arr);
  }
}

export default formatDateArray;
