import React, { useEffect } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  createFormActions,
  FormEffectHooks,
  createEffectHook,
  Submit,
  Reset
} from '@formily/antd' // 或者 @formily/next
import { Input, Select } from '@formily/antd-components'
import { merge } from 'rxjs'
import { combineLatest } from 'rxjs/operators'
import 'antd/dist/antd.css';



const { 
  onFieldValueChange$, 
  onFormSubmitStart$,
  onFormMount$
} = FormEffectHooks;

const useOneToManyEffects = () => {
  const { setFieldState } = createFormActions();
  onFieldValueChange$('aa').subscribe(({ value }) => {
    setFieldState('*(bb,cc,dd)', state => {
      state.visible = value;
    })
  })
}

const useValidator = (name, validator) => {
  const { setFieldState } = createFormActions();
  merge(onFieldValueChange$(name), onFormSubmitStart$()).subscribe(() => {
    setFieldState(name, state => {
      state.errors = validator(state.value, state)
    })
  })
}

const useManyToOne = () => {
  const { setFieldState } = createFormActions();

  onFieldValueChange$('bb').subscribe(({ value }) => {
    setFieldState('aa', state => {
      state.visible = value;
    })
  });

  onFieldValueChange$('cc').subscribe(({ value }) => {
    setFieldState('aa', state => {
      state.value = value;
    })
  })
}

const customEvent$ = createEffectHook('CUSTOM_EVENT')
const useMultiDepsEffects = () => {
  const { setFieldState, dispatch } = createFormActions();
  onFormMount$().subscribe(() => {
    setTimeout(() => {
      dispatch('CUSTOM_EVENT', true)
    }, 3000)
  })

  onFieldValueChange$('aa')
    .pipe(combineLatest(customEvent$()))
    .subscribe((params) => {
      const [{ value, values }, visible ] = params;

      console.log('value values:', value, values)

      setFieldState('bb', state => {
        state.visible = visible;
      })

      setFieldState('cc', state => {
        state.visible = value;

        if (values[1] && values[1]['data-other-nfo']) {
          state.value = values[1]['data-other-nfo']
        }
      })
    })
}

const Linkage = () => {
  return (
    <div className='linkage'>
      <h2>Formily 一对多联动</h2>
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

      <h2>Formily 自己联动自己(副作用校验)</h2>
      <SchemaForm
        components={{ Input }}
        onSubmit={(values) => console.log('values:', values)}
        effects={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useValidator('mm', (value) => !value ? '必填字段' : '')
        }}
      >
        <Field type='string' name='mm' title='MM' x-component='Input' />
        <FormButtonGroup>
          <Submit>提交</Submit>
          <Reset>重置</Reset>
        </FormButtonGroup>
      </SchemaForm>

      <h2>Formily 多对一联动</h2>
      <SchemaForm
        components={{ Input, Select }}
        effects={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useManyToOne();
        }}
      >
        <Field type='string' name='aa' title='AA' x-component='Input' />
        <Field 
          type='string' 
          name='bb' 
          title='bb' 
          x-component='Select'
          enum={[
            { label: 'visible', value: true },
            { label: 'hidden', value: false },
          ]}
          default={false}
        />
        <Field type='string' name='cc' title='CC' x-component='Input' />

      </SchemaForm>

      <h2>多依赖联动</h2>
      <SchemaForm
        components={{ Input, Select }}
        onSubmit={values => {
          console.log(values)
        }}
        effects={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useMultiDepsEffects()
        }}
      >
        <Field
          type="string"
          enum={[
            { label: 'visible', value: true, 'data-other-nfo': '123' },
            { label: 'hidden', value: false, 'data-other-nfo': '321' }
          ]}
          default={false}
          name="aa"
          title="AA"
          x-component="Select"
        />
        <Field
          type="string"
          name="bb"
          visible={false}
          title="BB"
          x-component="Input"
        />
        <Field type="string" name="cc" title="CC" x-component="Input" />
      </SchemaForm>
    </div>
  )
}

export default Linkage;
