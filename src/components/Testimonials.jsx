import React, { useEffect, useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const testimonials = [
  {
    name: 'Antonio Banderas',
    age: 35,
    occupation: 'Engineer',
    testimony:
      "The counselling sessions were life-changing. Their team's dedication and professionalism helped me find balance in my stressful work life. I can't thank them enough for this transformation!",
  },
  {
    name: 'Lena Kim',
    age: 28,
    occupation: 'Doctor',
    testimony:
      "As a doctor, I'm used to helping others. But when I needed help, their team was there for me. The sessions were insightful, helped me manage my stress and improved my overall well-being.",
  },
  {
    name: 'Yasmin Al Salem',
    age: 45,
    occupation: 'Teacher',
    testimony:
      'I faced burnout due to the high stress of my profession. The counselling sessions were my lifeline, providing me with practical coping strategies and renewing my passion for teaching.',
  },
  {
    name: 'John Okafor',
    age: 30,
    occupation: 'Artist',
    testimony:
      'I was experiencing a creative block before starting counselling. Their team helped me rediscover my inspiration, fostering my creativity and bringing a fresh perspective to my art.',
  },
  {
    name: 'Carlos Santiago',
    age: 32,
    occupation: 'Software Developer',
    testimony:
      'Juggling high workloads and tight deadlines had become overwhelming. The counselling sessions helped me develop a healthier work-life balance, significantly improving my productivity and mental health.',
  },
  {
    name: 'Sarah Johnson',
    age: 37,
    occupation: 'Designer',
    testimony:
      'The counselling sessions provided me with invaluable support and understanding during a tough time. They helped me grow, personally and professionally, enabling me to approach my design work with renewed energy and creativity.',
  },
  {
    name: 'Amit Patel',
    age: 34,
    occupation: 'Manager',
    testimony:
      'Managing a team was causing me a lot of stress. The counselling sessions were a game changer, providing me with strategies to manage stress and improve my leadership skills.',
  },
  {
    name: 'Chen Wei',
    age: 29,
    occupation: 'Marketer',
    testimony:
      'The counselling sessions were transformative, helping me regain my confidence and creativity. I can now face my marketing challenges with a positive mindset.',
  },
  {
    name: 'Aliyah Mohammed',
    age: 31,
    occupation: 'Lawyer',
    testimony:
      'Being a lawyer involves long hours and high stress. The counselling sessions provided the support I needed to handle it, making them an integral part of my self-care routine.',
  },
  {
    name: 'Hiroshi Tanaka',
    age: 40,
    occupation: 'Entrepreneur',
    testimony:
      'The counselling sessions helped me manage the stress and uncertainties of entrepreneurship. I can now focus better on growing my business, knowing I have their reliable support.',
  },
  {
    name: 'Oliver Smith',
    age: 36,
    occupation: 'Musician',
    testimony:
      'Their counselling sessions helped me overcome performance anxiety. They inspired me to express my emotions through music, which has been incredibly liberating.',
  },
  {
    name: 'Sophia Davis',
    age: 39,
    occupation: 'Writer',
    testimony:
      "I was facing writer's block and struggling to balance my personal life with my writing career. The counselling sessions were my beacon of hope, providing me with the support I needed to continue my writing journey.",
  },
]

function Testimonials() {
  const sliderRef = useRef()
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className='mt-8 bg-bg-custom text-secondary'>
      <Slider ref={sliderRef} {...settings}>
        {testimonials.map((t, index) => (
          <div
            key={index}
            className='p-4 border rounded shadow flex flex-col justify-center bg-highlight text-secondary'
          >
            <h3 className='font-bold text-center text-primary text-2xl'>
              {t.name}
            </h3>
            <p className='text-lg text-center m-5'>
              {t.age}, {t.occupation}
            </p>
            <p className='italic mt-2 text-lg'>{t.testimony}</p>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Testimonials
