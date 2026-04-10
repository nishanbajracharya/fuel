import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStorage } from 'react-hook-form-storage';

import { H1 } from '@/components/ui/h1';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const fuelSchema = z.object({
  range: z.coerce
    .number('Enter a number')
    .positive('Range must be greater than 0'),
  mileage: z.coerce
    .number('Enter a number')
    .positive('Mileage must be greater than 0'),
  totalFuel: z.coerce
    .number('Enter a number')
    .positive('Total fuel must be greater than 0'),
  petrolPrice: z.coerce
    .number('Enter a number')
    .positive('Price must be greater than 0'),
});

type Inputs = z.infer<typeof fuelSchema>;

function isValidValue(value: number | null): value is number {
  return value !== null && !isNaN(value) && isFinite(value);
}

function App() {
  const [fuelLeft, setFuelLeft] = useState<number | null>(null);
  const [fuelCost, setFuelCost] = useState<number | null>(null);
  const [fuelNeeded, setFuelNeeded] = useState<number | null>(null);

  const form = useForm({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      range: 0,
      mileage: 0,
      totalFuel: 35,
      petrolPrice: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useFormStorage('fuel-calculator-data', form);

  function calculateFuelRemaining(data: Inputs) {
    const { range, mileage, totalFuel, petrolPrice } = data;

    const fuelLeft = range / mileage;
    const fuelNeeded = totalFuel - fuelLeft;
    const fuelCost = fuelNeeded * petrolPrice;

    setFuelLeft(fuelLeft);
    setFuelCost(fuelCost);
    setFuelNeeded(fuelNeeded);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleSubmit(calculateFuelRemaining)}
        className="w-full max-w-sm"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <H1>Calculate Fuel Remaining</H1>
          </CardHeader>
          <CardContent>
            <Field className="mb-4" data-invalid={errors.range?.message}>
              <FieldLabel htmlFor="range">Range</FieldLabel>
              <Input id="range" type="text" {...register('range')} />
              <FieldError>{errors.range?.message}</FieldError>
            </Field>
            <Field className="mb-4" data-invalid={errors.mileage?.message}>
              <FieldLabel htmlFor="mileage">Mileage</FieldLabel>
              <Input id="mileage" type="text" {...register('mileage')} />
              <FieldError>{errors.mileage?.message}</FieldError>
            </Field>
            <Field className="mb-4" data-invalid={errors.totalFuel?.message}>
              <FieldLabel htmlFor="totalFuel">Total Fuel</FieldLabel>
              <Input id="totalFuel" type="text" {...register('totalFuel')} />
              <FieldError>{errors.totalFuel?.message}</FieldError>
            </Field>
            <Field className="mb-4" data-invalid={errors.petrolPrice?.message}>
              <FieldLabel htmlFor="petrolPrice">Petrol Price</FieldLabel>
              <Input
                id="petrolPrice"
                type="text"
                {...register('petrolPrice')}
              />
              <FieldError>{errors.petrolPrice?.message}</FieldError>
            </Field>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              <strong>Calculate</strong>
            </Button>

            <Table>
              <TableBody>
                {isValidValue(fuelLeft) && (
                  <TableRow>
                    <TableCell>Fuel Left:</TableCell>
                    <TableCell className="text-right">
                      <strong>{Number(fuelLeft).toFixed(2)} ltr</strong>
                    </TableCell>
                  </TableRow>
                )}
                {isValidValue(fuelNeeded) && (
                  <TableRow>
                    <TableCell>Fuel Needed:</TableCell>
                    <TableCell className="text-right">
                      <strong>{Number(fuelNeeded).toFixed(2)} ltr</strong>
                    </TableCell>
                  </TableRow>
                )}
                {isValidValue(fuelCost) && (
                  <TableRow>
                    <TableCell>Fuel Cost:</TableCell>
                    <TableCell className="text-right">
                      <strong>Rs. {Number(fuelCost).toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default App;
