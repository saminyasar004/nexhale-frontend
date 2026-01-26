import { useState, useCallback } from "react";

const MIN_AGE = 15;

interface AgeValidationResult {
  isValidAge: boolean;
  ageError: string | null;
  validateAge: (age: number) => boolean;
  checkCanSubmit: () => boolean;
}

export const useAgeValidation = (userAge: number = 0): AgeValidationResult => {
  const [ageError, setAgeError] = useState<string | null>(null);

  const validateAge = useCallback((age: number): boolean => {
    if (age < MIN_AGE) {
      setAgeError(`You must be ${MIN_AGE}+ years old to use Nexhale`);
      return false;
    }
    setAgeError(null);
    return true;
  }, []);

  const checkCanSubmit = useCallback((): boolean => {
    if (userAge < MIN_AGE) {
      setAgeError(`You must be ${MIN_AGE}+ years old to use Nexhale`);
      return false;
    }
    setAgeError(null);
    return true;
  }, [userAge]);

  const isValidAge = userAge >= MIN_AGE;

  return {
    isValidAge,
    ageError,
    validateAge,
    checkCanSubmit,
  };
};

export default useAgeValidation;
