import React, { useEffect} from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  createFormActions,
  FormEffectHooks,
  Submit,
  Reset
} from '@formily/antd' // 或者 @formily/next
import { Input, Select } from '@formily/antd-components'
import 'antd/dist/antd.css';

const { onFieldChange$ } = FormEffectHooks;

const useOneToManyEffects = () => {
  const { setFieldState } = createFormActions();
  onFieldChange$('aa').subscribe(({ value }) => {
    setFieldState('*(bb,cc,dd)', state => {
      state.visible = value;
    })
  })
}

const Linkage = () => {
  return (
    <div className='linkage'>
      <h2>Formily 复杂联动</h2>
      <SchemaForm
        components={{
          Input,
          Select,
        }}
        onSubmit={(values) => console.log('values:', values)}
        effects={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useOneToManyEffects()
        }}
      >
        <Field
          type='string'
          enum={[
            { label: 'visible', value: true },
            { label: 'hidden', value: false },
          ]}
          default={false}
          name='aa'
          title='AA'
          x-component='Select'
        />
        <Field type='string' name='bb' title='BB' x-component='Input' />
        <Field type='string' name='cc' title='CC' x-component='Input' />
        <Field type='string' name='dd' title='DD' x-component='Input' />
        <Field type='string' name='ee' title='EE' x-component='Input' />

        <FormButtonGroup>
          <Submit>提交</Submit>
          <Reset>重置</Reset>
        </FormButtonGroup>
      </SchemaForm>
    </div>
  )
}

export default Linkage;
