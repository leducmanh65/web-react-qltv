import { useState, useEffect } from 'react';

/**
 * @param apiCallFn Hàm gọi API (ví dụ: api.getAllBooks, api.getAllUsers)
 * @param initialData Giá trị khởi tạo cho dữ liệu
 * @param dependencies Mảng dependency để Hook chạy lại (giống useEffect)
 * @returns {data, loading, error, refetch}
 */
export const useFetchData = <T>(
  apiCallFn: () =>  Promise<any> | null, 
  initialData: T,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0); 

  useEffect(() => {
   
     if (!apiCallFn) {
        setData(initialData); 
        return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCallFn(); 
        setData(result as T); 
      } catch (err: any) {
        setError(err);
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

  }, [apiCallFn, ...dependencies, refetchIndex]);
  const refetch = () => setRefetchIndex(prev => prev + 1);

  return { data, loading, error, refetch };
};