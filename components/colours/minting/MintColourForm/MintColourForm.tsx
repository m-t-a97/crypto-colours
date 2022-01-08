import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button, CircularProgress, TextField } from '@mui/material';
import _ from 'lodash';

import styles from './MintColourForm.module.scss';
import MintColourFormLogic, { MintColourFormData } from './MintColourFormLogic';

const MintColourForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<MintColourFormData>({
    mode: "onChange",
    defaultValues: {
      hexColourCode: "",
      price: 0,
    },
  });

  const { mintNewToken } = MintColourFormLogic();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit: SubmitHandler<MintColourFormData> = async (
    data: MintColourFormData
  ) => {
    try {
      setIsLoading(true);
      await mintNewToken(data);
      reset();
      setErrorMessage("");
    } catch (error) {
      console.error("[MintColourForm][onSubmit]:", error);

      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mintColourFormContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.formTitle}>Mint a new colour</h1>

        <div className={styles.textFieldContainer}>
          <label className={styles.textFieldLabel}>Hex Code:</label>

          <Controller
            name="hexColourCode"
            control={control}
            rules={{
              required: true,
              minLength: 6,
              maxLength: 6,
              pattern: /^[A-Za-z0-9]+$/i,
            }}
            render={({ field }) => (
              <TextField variant="outlined" placeholder="XXXXXX" {...field} />
            )}
          />
        </div>

        <div className={styles.textFieldContainer}>
          <label className={styles.textFieldLabel}>Price:</label>

          <Controller
            name="price"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => <TextField variant="outlined" {...field} />}
          />
        </div>

        {!_.isEmpty(errorMessage) && (
          <p className="text-base text-red-500">{errorMessage}</p>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-4"
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <span className="text-black hover:text-white">MINT TOKEN</span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default MintColourForm;
