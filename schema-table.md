# Schema Table

Dokumentasi ringkas atribut dan relasi berdasarkan schema final migration project ini.

Catatan migration: tabel `task_users`, `task_label_maps`, `task_bookmarks`, `task_files`, `task_todo_files`, dan `task_movement_histories` pernah dibuat di initial migration, lalu datanya dipindahkan ke kolom JSON dan tabelnya dihapus oleh migration `1712920000003-consolidate-task-schema`.

## users

Atribut: `id`, `username`, `email`, `password`, `name`, `phone_no`, `is_verified`, `role`, `status`, `photo`, `created_at`, `updated_at`.

Relasi: punya banyak `projects`, `task`, `task_todos`, `timelogs`, `sticky_notes`, `manager_notes`, dan `notifications`.

## projects

Atribut: `id`, `user_id`, `label`, `description`, `photo`, `created_at`, `updated_at`.

Relasi: dimiliki oleh `users` lewat `user_id`, punya banyak `task`. Response project juga menyertakan `task_id` berupa daftar id task yang terkait.

## task

Atribut: `id`, `project_id`, `user_id`, `task_todo_id`, `title`, `description`, `due_date`, `estimate_time`, `finish_date`, `status`, `order_index`, `progress`, `moved_at`, `completed_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `board_column`, `assignee_user_ids`, `label_ids`, `bookmarks`, `files`, `movement_history`.

Relasi: dimiliki oleh `projects` lewat `project_id`, dimiliki oleh `users` lewat `user_id`, punya banyak `task_todos`, punya default/utama `task_todos` lewat `task_todo_id`, punya user audit lewat `created_by` dan `updated_by`, punya banyak `notifications`.

Catatan: `assignee_user_ids`, `label_ids`, `bookmarks`, `files`, dan `movement_history` adalah kolom JSON hasil konsolidasi dari tabel lama.

## task_labels

Atribut: `id`, `name`, `color`.

Relasi: dipakai oleh `task.label_ids` sebagai daftar id label dalam bentuk JSON.

## task_todos

Atribut: `id`, `task_id`, `user_id`, `label`, `progress`, `status`, `estimate_time`, `due_date`, `finish_date`, `files`, `created_by`, `updated_by`, `created_at`, `updated_at`.

Relasi: dimiliki oleh `task` lewat `task_id`, di-assign ke `users` lewat `user_id`, punya banyak `timelogs`, punya user audit lewat `created_by` dan `updated_by`.

Catatan: `files` adalah kolom JSON hasil konsolidasi dari tabel lama `task_todo_files`. `user_id` task todo harus termasuk dalam user task induk, yaitu `task.user_id` atau `task.assignee_user_ids`.

## timelogs

Atribut: `id`, `user_id`, `task_todo_id`, `name`, `time`, `status`, `start`, `end`, `start_note`, `end_note`, `minuted_logged`, `created_at`, `updated_at`.

Relasi: dimiliki oleh `users` lewat `user_id`, opsional terkait ke `task_todos` lewat `task_todo_id`, punya banyak `timelog_file`. Response timelog menyertakan data file pada `files` dan alias `timelog_file`.

## timelog_file

Atribut: `id`, `timelog_id`, `file_url`, `file_path`, `photo`, `note`.

Relasi: dimiliki oleh `timelogs` lewat `timelog_id`.

## sticky_notes

Atribut: `id`, `user_id`, `title`, `description`.

Relasi: dimiliki oleh `users` lewat `user_id`.

## manager_notes

Atribut: `id`, `user_id`, `title`, `description`.

Relasi: dimiliki oleh `users` lewat `user_id`.

Catatan: `user_id` adalah penerima manager note. Manager note hanya bisa dibuat/dipindahkan ke user dengan role `member` atau `admin`; daftar penerima tersedia dari endpoint `GET /manager-notes/recipients`.

## notifications

Atribut: `id`, `task_id`, `user_id`, `title`, `message`, `is_read`, `created_at`, `updated_at`.

Relasi: dimiliki oleh `task` lewat `task_id`, dimiliki oleh `users` lewat `user_id`.
