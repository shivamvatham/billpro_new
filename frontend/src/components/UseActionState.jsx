import { useActionState } from "react"

export default function UseActionState(){
    const [state,action,pending] = useActionState(submitForm,{
        name:'shivam',
        password:'123'
    })
    async function submitForm(prevData,formData){
        await new Promise(res=>setTimeout(res,2000))
        const name = formData.get('name')
        const password = formData.get('password')
        if(!name || !password){
            return{message:'enter proper details',name,password}
        }else{
            return {message:'data submitted successfully',name,password}
        }
    }
    return(
        <div>
            <h2>Use Action State Sample</h2>
            <hr />
            <form action={action}>
                <input defaultValue={state?.name} type="text" placeholder="enter username" name="name" />
                <br />
                <br />
                <input defaultValue={state?.password} type="text" placeholder="enter password" name="password" />
                <br />
                <br />
                <button disabled={pending}>submit</button>
            </form>
            {
                state?.message
            }
        </div>
    )
}