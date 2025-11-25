import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'

export const SelectGender = () => {
  const id = useId()

  return (
    <div className='grid gap-3'>
      <Label htmlFor={id}>Gender</Label>
      <SelectNative id={id} defaultValue=''>
        <option value='' disabled>
          Please select a gender
        </option>
        <option value='1'>Male</option>
        <option value='2'>Female</option>
        <option value='3'>Other</option>
      </SelectNative>
    </div>
  )
}
