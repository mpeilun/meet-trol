import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

function UserProfilePage() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR<Array<User>>('https://random-data-api.com/api/v2/users?size=10', fetcher)
  // const [userName, setUserName] = useState<Array<string>>([])

  // useEffect(() => {
  //   if (data) {
  //     let temp: Array<string> = []
  //     for (const user in data) {
  //       temp.push(user)
  //     }
  //     setUserName(temp)
  //   }
  // }, [data])

  if (error) {
    return <p>{error}</p>
  }

  if (isLoading) {
    return <p>loading...</p>
  }

  console.log(data)

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.username}</li>
      ))}
    </ul>
  )
}

export default UserProfilePage

export interface User {
  id: number
  uid: string
  password: string
  first_name: string
  last_name: string
  username: string
  email: string
  avatar: string
  gender: string
  phone_number: string
  social_insurance_number: string
  date_of_birth: Date
  employment: Employment
  address: Address
  credit_card: CreditCard
  subscription: Subscription
}

export interface Address {
  city: string
  street_name: string
  street_address: string
  zip_code: string
  state: string
  country: Country
  coordinates: Coordinates
}

export interface Coordinates {
  lat: number
  lng: number
}

export enum Country {
  UnitedStates = 'United States',
}

export interface CreditCard {
  cc_number: string
}

export interface Employment {
  title: string
  key_skill: string
}

export interface Subscription {
  plan: string
  status: string
  payment_method: string
  term: Term
}

export enum Term {
  Annual = 'Annual',
  FullSubscription = 'Full subscription',
  Monthly = 'Monthly',
}
