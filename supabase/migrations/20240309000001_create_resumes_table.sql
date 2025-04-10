-- Create resumes table
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  path text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ats_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.resumes enable row level security;

-- Create policies
create policy "Users can view their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_resumes_updated_at
  before update on public.resumes
  for each row
  execute function public.handle_updated_at(); 