import { random } from 'faker'
import { factory, primaryKey } from '../../src'
import { identity } from '../../src/utils/identity'

test('returns the only matching entity', () => {
  const userId = random.uuid()
  const db = factory({
    user: {
      id: primaryKey(identity(userId)),
    },
  })

  db.user.create()

  const user = db.user.findFirst({
    which: {
      id: {
        equals: userId,
      },
    },
  })
  expect(user).toHaveProperty('id', userId)
})

test('returns the first entity among multiple matching entities', () => {
  const db = factory({
    user: {
      id: primaryKey(random.uuid),
      followersCount: Number,
    },
  })

  db.user.create({ followersCount: 10 })
  db.user.create({ followersCount: 12 })
  db.user.create({ followersCount: 15 })

  const user = db.user.findFirst({
    which: {
      followersCount: {
        gt: 10,
      },
    },
  })
  expect(user).toHaveProperty('followersCount', 12)
})

test('throws an exception when no results in strict mode', () => {
  const db = factory({
    user: {
      id: primaryKey(random.uuid),
    },
  })
  db.user.create()

  expect(() => {
    db.user.findFirst({
      which: {
        id: {
          equals: 'abc-123',
        },
      },
      strict: true,
    })
  }).toThrowError(
    `Failed to execute "findFirst" on the "user" model: no entity found matching the query "{"id":{"equals":"abc-123"}}".`,
  )
})

test('returns null when found no matching entities', () => {
  const db = factory({
    user: {
      id: primaryKey(random.uuid),
    },
  })
  db.user.create()

  const user = db.user.findFirst({
    which: {
      id: {
        equals: 'abc-123',
      },
    },
  })
  expect(user).toBeNull()
})
