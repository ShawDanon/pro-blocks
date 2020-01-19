import { Form, Button, Col, Input, Popover, Progress, Row, Select, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { FC, useState, useEffect } from 'react';
import { Store } from 'rc-field-form/es/interface';
import { Dispatch } from 'redux';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';

import { StateType } from './model';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="BLOCK_NAME.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="BLOCK_NAME.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="BLOCK_NAME.strength.short" />
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface PAGE_NAME_UPPER_CAMEL_CASEProps {
  dispatch: Dispatch<any>;
  BLOCK_NAME_CAMEL_CASE: StateType;
  submitting: boolean;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

const PAGE_NAME_UPPER_CAMEL_CASE: FC<PAGE_NAME_UPPER_CAMEL_CASEProps> = ({
  submitting,
  dispatch,
  BLOCK_NAME_CAMEL_CASE,
}) => {
  // state
  const [count, setcount]: [number, any] = useState(0);
  const [visible, setvisible]: [boolean, any] = useState(false);
  const [prefix, setprefix]: [string, any] = useState('86');
  const [popover, setpopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  console.log('渲染', { count, visible, prefix });
  //
  let interval: number | undefined;

  // render
  const [form] = Form.useForm();
  //
  useEffect(() => {
    console.log('更新', BLOCK_NAME_CAMEL_CASE);
    if (!BLOCK_NAME_CAMEL_CASE) {
      return;
    }
    const account = form.getFieldValue('mail');
    if (BLOCK_NAME_CAMEL_CASE.status === 'ok') {
      message.success('注册成功！');
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }, [BLOCK_NAME_CAMEL_CASE]);
  useEffect(() => {
    console.log('加载');
    return () => {
      console.log('卸载');
      clearInterval(interval);
    };
  }, []);
  // onGetCaptcha
  const onGetCaptcha = () => {
    console.log('onGetCaptcha');
    let counts = 59;
    setcount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setcount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  // getPasswordStatus
  const getPasswordStatus = () => {
    console.log('getPasswordStatus');
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  // handleSubmit
  const onFinish = (values: Store) => {
    console.log('onFinish');
    dispatch({
      type: 'BLOCK_NAME_CAMEL_CASE/submit',
      payload: {
        ...values,
        prefix,
      },
    });
  };
  // checkConfirm
  const checkConfirm = (_: any, value: string) => {
    console.log('checkConfirm');
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({ id: 'BLOCK_NAME.password.twice' }));
    }
    return promise.resolve();
  };
  // checkPassword
  const checkPassword = (_: any, value: string) => {
    console.log('checkPassword');
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setvisible(!!value);
      return promise.reject(formatMessage({ id: 'BLOCK_NAME.password.required' }));
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  // changePrefix
  const changePrefix = (value: string) => {
    console.log('changePrefix');
    setprefix(value);
  };
  // renderPasswordProgress
  const renderPasswordProgress = () => {
    console.log('renderPasswordProgress');
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.main}>
      <h3>
        <FormattedMessage id="BLOCK_NAME.register.register" />
      </h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="mail"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'BLOCK_NAME.email.required' }),
            },
            {
              type: 'email',
              message: formatMessage({ id: 'BLOCK_NAME.email.wrong-format' }),
            },
          ]}
        >
          <Input size="large" placeholder={formatMessage({ id: 'BLOCK_NAME.email.placeholder' })} />
        </FormItem>
        <Popover
          getPopupContainer={node => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
            }
            return node;
          }}
          content={
            visible && (
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  <FormattedMessage id="BLOCK_NAME.strength.msg" />
                </div>
              </div>
            )
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({ id: 'BLOCK_NAME.password.placeholder' })}
            />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'BLOCK_NAME.confirm-password.required' }),
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({ id: 'BLOCK_NAME.confirm-password.placeholder' })}
          />
        </FormItem>
        <InputGroup compact>
          <Select size="large" value={prefix} onChange={changePrefix} style={{ width: '20%' }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{ width: '80%' }}
            name="mobile"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'BLOCK_NAME.phone-number.required' }),
              },
              {
                pattern: /^\d{11}$/,
                message: formatMessage({ id: 'BLOCK_NAME.phone-number.wrong-format' }),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={formatMessage({ id: 'BLOCK_NAME.phone-number.placeholder' })}
            />
          </FormItem>
        </InputGroup>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'BLOCK_NAME.verification-code.required' }),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={formatMessage({ id: 'BLOCK_NAME.verification-code.placeholder' })}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count
                ? `${count} s`
                : formatMessage({ id: 'BLOCK_NAME.register.get-verification-code' })}
            </Button>
          </Col>
        </Row>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <FormattedMessage id="BLOCK_NAME.register.register" />
          </Button>
          <Link className={styles.login} to="/user/login">
            <FormattedMessage id="BLOCK_NAME.register.sign-in" />
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};
export default connect(
  ({
    BLOCK_NAME_CAMEL_CASE,
    loading,
  }: {
    BLOCK_NAME_CAMEL_CASE: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    BLOCK_NAME_CAMEL_CASE,
    submitting: loading.effects['BLOCK_NAME_CAMEL_CASE/submit'],
  }),
)(
  (() => {
    console.log('xr');
    return PAGE_NAME_UPPER_CAMEL_CASE;
  })(),
);
