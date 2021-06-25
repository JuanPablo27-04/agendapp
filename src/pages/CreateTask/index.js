import { useHistory } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Topbar } from "../../components/Topbar";
import Select from "react-select";
import DatePicker from "react-date-picker";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "./styles";
import { FormGroup, LabelError } from "../../globalStyles";
import { HTTP_VERBS, requestHttp } from "../../utils/HttpRequest";


const CreateTask = ({ title }) => {
  const [users,setUsers] = useState([])
  const history = useHistory()
  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm({ mode: 'onChange' });

  const onSubmitCreate = async (data) => {
    
    console.log("data form", data);
    try { const CreateTask = {
      ...data,
      responsible : data.responsible.value,
      collaborators : data.collaborators.map(el => (el.value) ),
      due_date : data.due_date.toISOString()

    }
    const Respuesta = await requestHttp({
      method : HTTP_VERBS.POST,
      endpoint : 'tasks/create',
      data : CreateTask,
    })
    console.log(Respuesta)
    history.push('/')
    } catch (error) {
      alert('error')
      console.log(error)
    }
    
  };

  /*useEffect(() => {
    console.log('formState', formState);
  }, [formState])*/

  useEffect(() => {
    const Getusers = async () => {
      const Respuesta = await requestHttp({
        method : HTTP_VERBS.GET,
        endpoint : 'users',
      })
      console.log(Respuesta)
      const USERS = Respuesta.data.map(user => {
        return { value: user._id, label: user.name }
      })
      setUsers(USERS)
    }
    Getusers ()
  }, [])


  return (
    <Fragment>
      <Topbar title={title} />
      <form onSubmit={handleSubmit(onSubmitCreate)}>
        <FormGroup>
          <label>Task title</label>
          <Input 
            register={register} 
            name="title" 
            rules={{ required: true, minLength: 6 }}
            label="Task title" 
            type="text" 
            placeholder="Enter task title" 
          />
          { errors.taskTitle?.type === 'required' && <LabelError>Field required</LabelError> }
          { errors.taskTitle?.type === 'minLength' && <LabelError>Min Length 6 characters</LabelError> }
        </FormGroup>

        <FormGroup>
          <label>Responsible</label>
          <Controller
            name="responsible"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select responsible"
                options={users}
              />
            )}
          />
          { errors.responsible && <LabelError>Field required</LabelError> }
        </FormGroup>

        <FormGroup>
          <label>Collaborators</label>
          <Controller
            name="collaborators"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                placeholder="Select collaborators"
                options={users}
              />
            )}
          />
          { errors.collaborators && <LabelError>Field required</LabelError> }
        </FormGroup>
        <FormGroup>
          <label>Due Date</label>
          <div>
            <Controller
              name="due_date"
              control={control}
              defaultValue={new Date()}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker {...field} locale="en-EN" format="dd-MM-yy" />
              )}
            />
          </div>
          { errors.dueDateTask && <LabelError>Field required</LabelError> }
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <div>
            <Textarea 
              {...register("description", { required: true } )} 
              rows="3"
              errors={ errors.description }
            />
          </div>
          { errors.description && <LabelError>Field required</LabelError> }
        </FormGroup>
        <div>
          <Button disabled={!isValid} type="submit" text="Create" />
        </div>
      </form>
    </Fragment>
  );
};

export default CreateTask;
