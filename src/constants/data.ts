export const sortQuery = {
  order:{
    ASC: 1,
    DESC: -1
  }
}

export const getSaltValue = () => Math.round(Math.random()*(25-10+1)+10);