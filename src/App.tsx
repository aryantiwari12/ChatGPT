import { useState,useEffect } from 'react'
import send from "./assets/send.svg"
import logo from "./assets/logo.png"
import user from "./assets/user.png"
import bot from "./assets/bot.png"
import loaderIcon from "./assets/loader.svg"
import axios from 'axios'
let arr = [
  {
    type: "user", post: "good question"
  },
  {
    type: "bot", post: "good question"
  }
]

function App() {
  const [input, setInput] = useState("")
  const [post, setPosts] = useState<any[any]>([])
  // useEffect(()=>{
  //   document.querySelector(".layout").scrollTop=
  //   document.querySelector(".layout").scrollHeight
  // },[post]);
  const fetch = async () => {
    const { data } = await axios.post("http://localhost:4000", { input }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  }
  const onsubmit = () => {
    if (input.trim() === "") return;
    updatePost(input, '', '')
    updatePost("loading..", false, true)
    fetch().then((res: any) => {
      console.log(res)
      updatePost(res.bot.trim(), true, '')

    })
    setInput('')

  }
  const autores = (text: any) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState:any) => {
          let lats = prevState.pop()
          if (lats.type !== "bot") {
              prevState.push({
                type:"bot",
                post:text.charAt(index-1)
              })
          } else {
            prevState.push({
              type:"bot",
              post:lats.post+text.charAt(index-1)
            })
          }
          return [...prevState]
        })
        index++
      } else {
        clearInterval(interval)
      }
    }, 40)
  }
  const updatePost = (post: any, isBot: any, isloading: any) => {
    if (isBot) {
      autores(post)

    } else {
      setPosts((prevState:any) => {
        return [
          ...prevState,
          { type: isloading ? "loading" : "user", post }
        ]
      })

    }

  }

  const onkeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.which === 13) {
      onsubmit()
    }
  }

  return (
    <main className='chatGPT-app'>
      <section className='chat-container'>
        <div className='layout'>
          {post.map((post: any, index:any) => (
            <div key={index} className={`chat-bubble ${post.type === "bot" || post.type === "loading" ? "bot" : ''}`}>

              <div className="avatar">
                <img src={post.type === "bot" || post.type === "loading" ? bot : user} />
              </div>
              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loaderIcon} />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}

            </div>

          ))}
        </div>
      </section>
      <footer>
        <input
          value={input}
          className='composebar'
          autoFocus
          type='text'
          placeholder='Ask anything?'
          onChange={(e: any) => setInput(e.target.value)}
          onKeyUp={onkeyUp}
        >
        </input>
        <div className='send-button' onClick={onsubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  )
}

export default App
