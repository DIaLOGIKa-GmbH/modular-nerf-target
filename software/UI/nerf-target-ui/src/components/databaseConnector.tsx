import { useEffect, useState } from 'react';
import { Score } from './scoreBoard';


export interface UseFetchResult {
    data: any | null;
    isPending: boolean;
    error: any | null;
  }
  
export function useFetch() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchData = async (url) => {
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to get data');
          }
        const jsonData = await response.json();
        setData(jsonData);
        
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
    };
    return { fetchData, data, loading, error };
    
}
  
  

  export function usePost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const postData = async (url, data) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add data');
        }
  
        console.log('Data added successfully');
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    return { postData, loading, error };
  }
