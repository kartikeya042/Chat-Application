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


const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    // const [toaster] = useState(() => createToaster({ placement: "bottom-right" }));

    const postDetails = (pic) => {
        return new Promise((resolve) => {
            if (pic === undefined) {
                toaster.create({
                    title: "Please select an Image!",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                resolve(null);
                return;
            }

            if (pic.type === 'image/jpeg' || pic.type === 'image/png' || pic.type === 'image/jpg') {
                const data = new FormData();
                data.append("file", pic);
                data.append("upload_preset", "Chat App");
                data.append("cloud_name", "dvqw82ezs");
                fetch(process.env.REACT_APP_CLOUDINARY_URL, {
                    method: 'post',
                    body: data,
                }).then((res) => res.json())
                    .then(imageData => {
                        console.log(imageData);
                        console.log(imageData.url.toString());
                        resolve(imageData.url.toString());
                    })
                    .catch((err) => {
                        console.log(err);
                        toaster.create({
                            title: 'Error uploading image',
                            status: 'error',
                        });
                        resolve(null);
                    })
            } else {
                toaster.create({
                    title: `Please Select an Image!`,
                    status: "warning",
                })
                resolve(null);
            }
        });
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toaster.create({
                title: `Please fill all the fields.`,
                status: "warning",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toaster.create({
                title: "Password and Confirm Password do not match",
                status: "error",
            })
            setLoading(false);
            return;
        }

        let pic = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

        // If user selected an image, upload it first and wait for completion
        if (profilePicture && profilePicture.type) {
            const uploadedPic = await postDetails(profilePicture);
            if (!uploadedPic) {
                setLoading(false);
                return;
            }
            pic = uploadedPic;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post('/api/user', { name, email, password, pic }, config);
            toaster.create({
                title: "Registration Successful",
                status: "success"
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push('/chats')
        } catch (err) {
            toaster.create({
                title: 'Error Occured!',
                status: 'error',
                description: err.response?.data?.message || 'Something went wrong',
            });
            setLoading(false);
        }
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
                        onChange={(e) => setName(e.target.value)} />
                </Field.Root>

                <Field.Root required>
                    <Field.Label>Email address</Field.Label>
                    <Input
                        name="email"
                        type="email"
                        background={"gray.50"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Field.Root>

                <Field.Root required>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput
                        background={"gray.50"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Field.Root>

                <Field.Root required>
                    <Field.Label>Confirm Password</Field.Label>
                    <PasswordInput
                        background={"gray.50"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Profile Picture</Field.Label>
                    <Input
                        name="profilePicture"
                        type="file"
                        background={"gray.50"}
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])} />
                </Field.Root>

            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start" borderColor={"black"} background={"black"} color={"white"} width={'full'} onClick={submitHandler} isLoading={loading}>
                Submit
            </Button>
        </Fieldset.Root>
    )
}

export default SignUp;