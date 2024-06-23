function TasksStatus({ todos_completed, total_todos }) {
  return (
    <section className="status_section">
      <div>
        <p className="text_large">Task Done</p>
      </div>
      <div>
        {todos_completed}/{total_todos}
      </div>
    </section>
  );
}

export default TasksStatus;
