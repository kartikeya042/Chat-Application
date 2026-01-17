import React from "react";
import { useState } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
} from "@chakra-ui/react"
import { PasswordInput } from "../ui/password-input";
const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPasssword] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const submitHandler = () =>{
        
    }
    
    return (
        <Fieldset.Root size="lg" maxW="md">
            <Stack>
                <Fieldset.Legend color={"black"}>Sign Up details</Fieldset.Legend>
                <Fieldset.HelperText color={"gray.500"}>
                    Please provide your details below.
                </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Field.Root required>
                    <Field.Label>Name</Field.Label>
                    <Input 
                    name="name" 
                    background={"gray.50"} 
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
                </Field.Root>

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

                <Field.Root required>
                    <Field.Label>Confirm Password</Field.Label>
                    <PasswordInput
                        value={confirmPassword}
                        onChange={(e) => setConfirmPasssword(e.target.value)}
                    />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Profile Picture</Field.Label>
                    <Input
                    name="profilePicture"
                    type="file"
                    value={profilePicture}
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}/>
                </Field.Root>

            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start" borderColor={"black"} background={"black"} color={"white"} onClick={submitHandler}>
                Submit
            </Button>
        </Fieldset.Root>
    )
}

export default SignUp;