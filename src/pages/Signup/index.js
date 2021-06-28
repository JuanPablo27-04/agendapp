import React, { useEffect } from 'react'
import { FormGroup, LabelError, PageWrapper } from "../../globalStyles";
import { LogoWrapper, TopLink } from "../Signin/styles";
import { LinkTo } from "../../components/LinkTo";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useSelector, useDispatch } from 'react-redux';
import { fetchSignUp } from "../../store";
import { useHistory } from "react-router-dom";

export const Signup = () => {

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  let history = useHistory();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm({ mode: 'onChange' });
  useEffect(() => {
    console.log('userData =>', userData);
    if (userData.redirect) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])
  const onSubmitSignUp = async (data) => {
    dispatch(fetchSignUp(data));
  }
  return (
    <PageWrapper>
      <TopLink>
        <LinkTo text="Sign in" url="/" />
      </TopLink>
      <LogoWrapper>
        <img src="./assets/logo-color.png" alt="logo" />
      </LogoWrapper>
      {
        userData.error
      }
      <form onSubmit={handleSubmit(onSubmitSignUp)}>
        <FormGroup>
          <Input
            register={register}
            name="name"
            rules={{ required: true }}
            label="Name"
            type="text"
            placeholder="Enter your name"
          />
          {errors.name?.type === 'required' && <LabelError>Field required</LabelError>}
        </FormGroup>
        <FormGroup>
          <Input
            register={register}
            name="email"
            rules={{ required: true }}
            label="Email address"
            type="email"
            placeholder="Enter your email"
          />
          {errors.email?.type === 'required' && <LabelError>Field required</LabelError>}
        </FormGroup>
        <FormGroup>
          <Input
            register={register}
            name="password"
            rules={{ required: true, minLength: 6 }}
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          {errors.password?.type === 'required' && <LabelError>Field required</LabelError>}
          {errors.password?.type === 'minLength' && <LabelError>Min Length 6 characters</LabelError>}
        </FormGroup>
        <Button
          disabled={!isValid}
          type="submit"
          text={userData.loading ? 'Loading...' : 'Sign Up'} />
      </form>
    </PageWrapper>
  )
}
