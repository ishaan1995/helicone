alter table "public"."request" add column "parent_id" uuid;

alter table "public"."request" add constraint "request_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES request(id) not valid;

alter table "public"."request" validate constraint "request_parent_id_fkey";


