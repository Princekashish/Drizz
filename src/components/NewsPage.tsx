"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type source = {
    id?: string,
    name?: string,
}

type news = {
    author?: string,
    content?: string,
    description?: string,
    publishedAt?: string,
    title?: string,
    source?: source,
    url?: string,
    urlToImage?: string,
}

export default function NewsPage() {
    const [news, setNews] = useState<news[]>([]);
    useEffect(() => {
        newsdata()
    }, [])

    

    const newsdata = async () => {
        try {
            const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${process.env.NEXT_PUBLIC_NEWS_URL}`)
            setNews(data.articles)
        } catch (error) {

            console.log(error);


        }

    }





    return (
        <>
           
            <div className='p-5'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {
                        news.map((items, id) => {
                            return (
                                <div key={id} className=''>
                                    <div className='flex-col gap-2 flex'>
                                        <img src={items?.urlToImage} alt="" className='rounded-2xl ' />
                                        <h1>{items.content}</h1>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>

    )
}
