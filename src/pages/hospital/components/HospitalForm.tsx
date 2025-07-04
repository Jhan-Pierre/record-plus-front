import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import { useStates } from '@/hooks/state/useState';
import type { ApiError } from '@/types/errros/ApiError';
import { Button } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type HospitalCreateValues, hospitalCreateSchema } from '../models/hospitalCreateSchema';

interface Props {
  onSubmit: (data: HospitalCreateValues) => void;
  isSubmitting?: boolean;
  defaultValues?: HospitalCreateValues;
  apiErrors?: ApiError | null;
}

export const HospitalForm = ({ onSubmit, isSubmitting, defaultValues, apiErrors }: Props) => {
  const state = useStates().state;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setError,
    clearErrors,
  } = useForm<HospitalCreateValues>({
    resolver: zodResolver(hospitalCreateSchema),
    mode: 'onChange',
    defaultValues: defaultValues || {
      name: '',
      address: '',
      phone: '',
      email: '',
      ruc: '',
      stateId: 1,
    },
  });

  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    if (apiErrors?.details) {
      for (const detail of apiErrors.details) {
        if (detail.field) {
          setError(detail.field as keyof HospitalCreateValues, {
            type: 'backend',
            message: detail.message,
          });
        } else {
          setError('root.server', {
            type: 'backend',
            message: detail.message,
          });
        }
      }
    }
  }, [apiErrors, setError]);

  watch((value) => {
    const fields: (keyof HospitalCreateValues)[] = [
      'name',
      'address',
      'phone',
      'email',
      'ruc',
      'stateId',
    ];
    for (const field of fields) {
      if (value[field]) {
        clearErrors(field);
      }
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        name='name'
        control={control}
        label='Nombre del hospital'
        placeholder='Ingrese el nombre'
        error={errors.name}
        isRequired
      />
      <CustomInput
        name='address'
        control={control}
        label='Dirección'
        placeholder='Ingrese la dirección'
        error={errors.address}
        isRequired
      />
      <div className='grid grid-cols-2 gap-x-4'>
        <CustomInput
          name='email'
          control={control}
          label='Correo electrónico'
          placeholder='Ingrese el correo'
          error={errors.email}
          isRequired
        />
        <CustomInput
          name='phone'
          control={control}
          label='Teléfono'
          placeholder='Ingrese el teléfono'
          error={errors.phone}
          isRequired
        />
        <CustomInput
          name='ruc'
          control={control}
          label='RUC'
          placeholder='Ingrese el RUC'
          error={errors.ruc}
          isRequired
        />
        <CustomSelect
          name='stateId'
          control={control}
          label='Estado'
          options={state}
          error={errors.stateId}
        />
      </div>

      <div className='flex gap-2 mt-1'>
        <Button
          type='submit'
          color='primary'
          isLoading={isSubmitting}
          isDisabled={!isValid || !isDirty}
        >
          Guardar
        </Button>
        <Button onPress={handleGoBack}>Cancelar</Button>
      </div>
    </form>
  );
};
