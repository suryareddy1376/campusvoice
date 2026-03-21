-- Run this script in the Supabase SQL editor

alter table complaints add column if not exists department text check (department in ('Hostel','Academic','Infrastructure','IT','Cafeteria','Sports','Finance','Security','Emergency'));

alter table complaints add column if not exists escalation_level integer default 1;

alter table complaints add column if not exists escalated_at timestamp;

alter table complaints add column if not exists escalation_deadline timestamp;

alter table complaints add column if not exists assigned_to uuid references users(id);

alter table complaints drop constraint if exists complaints_status_check;
alter table complaints add constraint complaints_status_check check (status in (
  'Submitted',
  'Assigned',
  'In_Progress',
  'Resolved',
  'Resolved_On_Ground',
  'Escalated_To_HOD',
  'Escalated_To_Chairman'
));

create table if not exists department_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  department text not null check (department in ('Hostel','Academic','Infrastructure','IT','Cafeteria','Sports','Finance','Security','Emergency', 'All')),
  level integer not null check (level in (1,2,3)),
  created_at timestamp default now(),
  unique(user_id, department)
);

create index if not exists idx_complaints_department on complaints(department);
create index if not exists idx_complaints_escalation on complaints(escalation_level, status, created_at);
create index if not exists idx_dept_admins_lookup on department_admins(department, level);
