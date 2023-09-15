const TodosApp = {
    data() {
        return {
            isLoading: false,
            todos: [],
            enteredTodoText: "",
            editedTodoId: null
        };
    },
    methods: {
        async saveTodo(event) {
            event.preventDefault();
            if(this.editedTodoId) {
                // Updating a todo
                const todoId = this.editedTodoId;
                let response;
              
                try {
                  response = await fetch('http://localhost:3000/todos/' + todoId, {
                    method: 'PATCH',
                    body: JSON.stringify({
                      newText: this.enteredTodoText,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                } catch (error) {
                  alert('Something went wrong!');
                  return;
                }
              
                if (!response.ok) {
                  alert('Something went wrong!');
                  return;
                }

                const todoIndex = this.todos.findIndex((todoItem) => {
                    return todoItem.id === todoId;
                });

                const updatedTodoItem = {
                    id: this.todos[todoIndex].id,
                    text: this.enteredTodoText
                };

                this.todos[todoIndex] = updatedTodoItem;
                this.editedTodoId = null;

            } else {
                // Creating a new todo
                // Uploading to the server
                let response;

                try {
                  response = await fetch('http://localhost:3000/todos', {
                    method: 'POST',
                    body: JSON.stringify({
                      text: this.enteredTodoText,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                } catch (error) {
                  alert('Something went wrong!');
                  return;
                }
              
                if (!response.ok) {
                  alert('Something went wrong!');
                  return;
                }
              
                const responseData = await response.json();
                
                const newTodo = {
                    text: this.enteredTodoText,
                    id: responseData.createdTodo.id
                };
                
                this.todos.push(newTodo);
            }

            this.enteredTodoText = "";
        },
        startEditTodo(todoId) {
            this.editedTodoId = todoId;
            const todo = this.todos.find((todoItem) => {
                return todoItem.id === todoId;
            });
            this.enteredTodoText = todo.text;
        },
        async deleteTodo(todoId) {
            this.todos = this.todos.filter((todoItem) => {
                return todoItem.id != todoId;
            })

            let response;
          
            try {
                response = await fetch('http://localhost:3000/todos/' + todoId, {
                method: 'DELETE',
            });
            } catch (error) {
              alert('Something went wrong!');
              return;
            }
          
            if (!response.ok) {
              alert('Something went wrong!');
              return;
            }
        }
    },
    async created() {
        let response;
        this.isLoading = true;
        try {
          response = await fetch('http://localhost:3000/todos');
        } catch (error) {
          alert('Something went wrong!');
          return;
        }

        this.isLoading = false;
      
        if (!response.ok) {
          alert('Something went wrong!');
          return;
        }
      
        const responseData = await response.json();
        this.todos = responseData.todos;
    }
};

// We grab "#todos-app" because it's an ascendant of both form and ul, which we want to modify
Vue.createApp(TodosApp).mount("#todos-app");