
Some example queries for easy usage:

### Adding a workplace
mutation {
  addWorkplace(companyName: "Lol GmbH", country: "AT") {
    id
    companyName
    country
  }
}

### Adding a worker
mutation {
  addWorker(workplaceID: "15f15698-8f4d-4b91-b54c-fc78ce1397d6", input: {name: "Gustav", citizenship: "AT"}) {
    id
    name
    citizenship
    workplace {
      companyName
    }
  }
}

### Adding a student
mutation {
  addStudent(school: "St. Mary High School", input: {name: "Bob", citizenship: "IT"}) {
    id
    name
    citizenship
    school
  }
}

### Fetching a person
query {
  person(id: "e2004e47-40eb-4603-9abf-fe022d16891d") {
    id
    name
    citizenship
    __typename
    
    ... on Student {
    	school 
    }
    
    ... on Worker {
      workplace {
        companyName
      }
    }
  }
}

### Searching persons
query {
  searchPersons(searchTerm: "a") {
    __typename
    
    ... on Student {
      id
      name
      citizenship
      school
    }
    
    ... on Worker {
      id
      name
      citizenship
      workplace {
        companyName
      }
    }
  }
}