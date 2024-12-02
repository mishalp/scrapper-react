/* eslint-disable  @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { Skeleton } from "./components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const formSchema = z.object({
  ytId: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  username: z.string().min(2),
  fbId: z.string().min(2),
})

function App() {

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ytId: "UC8YFssUAoqhp5SOmYyvQEWQ",
      type: "Reel",
      username: "unmasking_anomalies",
      fbId: "100065838842606"
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/get-text`, values)
      setData(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(
      `
_${data?.type}_

*${data?.title}*
        
*Youtube*: ${data.youTube}
        
*FB*: ${data?.facebook}
        
*Insta*: ${data?.insta}
        
♡ ㅤ    ❍ㅤ     ⌲ 
ˡᶦᵏᵉ  ᶜᵒᵐᵐᵉⁿᵗ  ˢʰᵃʳᵉ
*Team U∆*`
    ).then(() => alert("Copied")).catch(() => alert("Failed to copy"))
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-4 mt-20 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-sm md:min-w-96">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="ytId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>YouTube Channel ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ytid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Reel">Reel</SelectItem>
                      <SelectItem value="Short Video">Short Video</SelectItem>
                      <SelectItem value="UA Podcast">UA Podcast</SelectItem>
                      <SelectItem value="Reaction Video">Reaction Video</SelectItem>
                      <SelectItem value="QnA">QnA</SelectItem>
                      <SelectItem value="Presentation">Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Instagram username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fbId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Facebook ID</FormLabel>
                <FormControl>
                  <Input placeholder="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            {loading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </> : <>
              Submit
            </>}
          </Button>
        </form>
      </Form>
      {loading && <div className="flex flex-col rounded">
        <Skeleton className="w-96 h-10" />
      </div>}
      {(data && !loading) && (
        <>
          <div id="board" className="p-2 bg-slate-100 shadow-inner overflow-auto max-w-full">
            <p className="italic">{data?.type}</p><br />
            <p className="font-bold">{data?.title}</p><br />
            <p><span className="font-bold">YouTube</span>:{data?.youTube}</p><br />
            <p><span className="font-bold">FB</span>:{data?.facebook}</p><br />
            <p><span className="font-bold">Insta</span>:{data?.insta}</p><br />
            <p>{"♡ ㅤ    ❍ㅤ     ⌲ "}</p>
            <p>{"ˡᶦᵏᵉ  ᶜᵒᵐᵐᵉⁿᵗ  ˢʰᵃʳᵉ"}</p><br />
            <p className="font-bold">{"Team U∆"}</p>
          </div>
          <Button onClick={copy}>Copy</Button>
        </>
      )}
    </div>
  )
}

export default App
