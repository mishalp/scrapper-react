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
  youTubeChannel: z.string().min(2).max(50),
  instagram: z.string().min(2).max(50),
  facebook: z.string().min(2),
  ytType: z.string().min(2),
})

// type YouTubeType = {
//   title: string;
//   thumbnail: string;
//   link: string;
// }


function App() {

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youTubeChannel: "",
      instagram: "",
      facebook: "",
      ytType: "videos"
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/scrapper`, values)
      setData(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    navigator.clipboard.writeText(
      `
      YouTube:${data?.youTube?.link}
      Insta:${data?.insta}
      FB:${data?.facebook}
      `
    )
    alert("done")
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-4 mt-20 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-sm md:min-w-96">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="youTubeChannel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>YouTube Channel</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/@UnmaskingAnomalies" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                    <FormField
          control={form.control}
          name="ytType"
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
                  <SelectItem value="videos">Video</SelectItem>
                  <SelectItem value="shorts">Short</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

          </div>
          <FormField
            control={form.control}
            name="instagram"
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
            name="facebook"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Facebook URL</FormLabel>
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
            <p>YouTube:{data?.youTube?.link}</p>
            <p>Insta:{data?.insta}</p>
            <p>FB:{data?.facebook}</p>
          </div>
          <Button onClick={copy}>Copy</Button>
        </>
      )}
    </div>
  )
}

export default App
