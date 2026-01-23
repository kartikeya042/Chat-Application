import React from "react";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
} from "@chakra-ui/react"
import { PasswordInput } from "../ui/password-input";
import axios from 'axios';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Login = () =>{
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [loading, setLoading] = useState(false);
        const history = useHistory();

        const submitHandler = async () => {
            setLoading(true);
            if(!email || !password){
                toaster.create({
                    title: 'Please fill all the fields.',
                    status: 'warning',
                });
                setLoading(false);
                return;
            }
            try{
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };
                const { data } = await axios.post('/api/user/login', {email, password}, config);
                toaster.create({
                    title: "Login Successful",
                    status: "success"
                });
                localStorage.setItem('userInfo', JSON.stringify(data));
                setLoading(false);
                history.push('/chats');
            } catch(err){
                toaster.create({
                    title: 'Error Occured!',
                    status: 'error',
                    description: err.response?.data?.message || 'Something went wrong',
                });
                setLoading(false);
            }
        }
    return (
            <Fieldset.Root size="lg" maxW="md" >
                <Stack>
                    <Fieldset.Legend color={"black"}>Login details</Fieldset.Legend>
                    <Fieldset.HelperText color={"gray.500"}>
                        Please enter your login credentials.
                    </Fieldset.HelperText>
                </Stack>
    
                <Fieldset.Content>
                    {/* <Field.Root required>
                        <Field.Label>Name</Field.Label>
                        <Input 
                        name="name" 
                        background={"gray.50"} 
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    </Field.Root> */}
    
                    <Field.Root required>
                        <Field.Label>Email address</Field.Label>
                        <Input 
                        name="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </Field.Root>
    
                    <Field.Root required>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field.Root>
    
                    {/* <Field.Root required>
                        <Field.Label>Confirm Password</Field.Label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPasssword(e.target.value)}
                        />
                    </Field.Root> */}
    
                    {/* <Field.Root>
                        <Field.Label>Profile Picture</Field.Label>
                        <Input
                        name="profilePicture"
                        type="file"
                        value={profilePicture}
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}/>
                    </Field.Root> */}
    
                </Fieldset.Content>
    
                <Button type="submit" alignSelf="flex-start" borderColor={"black"} background={"black"} color={"white"} width = {"full"} onClick={submitHandler} isLoading={loading}>
                    Submit
                </Button>
            </Fieldset.Root>
        )
}

export default Login;