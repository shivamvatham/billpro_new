import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "@/util/request"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/features/auth/authSlice"
import { Spinner } from "@/components/ui/spinner"

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
})

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: { username: "", password: "" },
    })

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            const response = await axios.post('/auth/login', data)
            console.log(response)
            dispatch(setCredentials({
                token: (response as unknown as {token : string}).token,
                user: response.data.user,
            }))
            navigate('/')
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field data-invalid={fieldState.invalid} >
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            {...field}
                                            id="username"
                                            placeholder="Enter your username"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )
                            }}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon
                                            className="cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            align="inline-end"
                                        >
                                            {showPassword ? <Eye /> : <EyeOff />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
