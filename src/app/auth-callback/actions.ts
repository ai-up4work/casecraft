// 'use server'

// import { db } from '@/db'
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// export const getAuthStatus = async () => {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()

//   if (!user?.id || !user.email) {
//     throw new Error('Invalid user data')
//   }

//   const existingUser = await db.user.findFirst({
//     where: { id: user.id },
//   })

//   if (!existingUser) {
//     await db.user.create({
//       data: {
//         id: user.id,
//         email: user.email,
//       },
//     })
//   }

//   return { success: true }
// }

'use server'

import { db } from '@/db'

const MOCK_USER = {
  id: 'mock_user_001',
  email: 'dev@example.com',
}

export const getAuthStatus = async () => {
  const user = MOCK_USER

  if (!user?.id || !user.email) {
    throw new Error('Invalid user data')
  }

  const existingUser = await db.user.findFirst({
    where: { id: user.id },
  })

  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    })
  }

  return { success: true }
}
