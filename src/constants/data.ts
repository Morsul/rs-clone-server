export const sortQuery = {
  order:{
    ASC: 1,
    DESC: -1
  }
}

export const getSaltValue = () => Math.round(Math.random()*(10-8+1)+8);