CREATE DATABASE Kanban task management;

CREATE TABLE board (
    id SERIAL PRIMARY KEY,
    name varchar(16) UNIQUE
);

CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    name varchar(150) NOT NULL,
    description varchar(300),
    created timestampz NOT NULL,
    status_id integer REFERENCES status(id) NOT NULL ON DELETE CASCADE ON UPDATE CASCADE,
    board_id integer REFERENCES board(id) NOT NULL ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE subtask (
    id SERIAL PRIMARY KEY,
    name varchar(200) NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    task_id integer REFERENCES task(id) NOT NULL ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL,
    board_id integer REFERENCES board(id) NOT NULL ON DELETE CASCADE ON UPDATE CASCADE,
    color char(7),
    UNIQUE (name, board_id)
);

CREATE INDEX task_board_name ON task(board_name);

CREATE INDEX subtask_task_id ON subtask(task_id);






INSERT INTO board VALUES ('Platform Launch'), ('Marketing Plan'), ('Roadmap');

INSERT INTO status(name, board_name) VALUES ('Todo', 'Platform Launch'), ('Doing', 'Platform Launch'), ('Done', 'Platform Launch'), ('Todo', 'Marketing Plan'), ('Todo', 'Roadmap');

INSERT INTO task(board_name, name, description, created, status) VALUES ('Platform Launch', 'Build UI for onboarding flow', null, 'now', 'Todo'), ('Platform Launch', 'Build UI for search', null, 'now', 'Todo'), ('Platform Launch', 'Build settings UI', null, 'now', 'Todo'), ('Platform Launch', 'QA and test all major user journeys', 'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.', 'now', 'Todo'), ('Platform Launch', 'Design settings and search pages', null, 'now', 'Doing'), ('Platform Launch', 'Add account management endpoints', null, 'now', 'Doing'), ('Platform Launch', 'Design onboarding flow', null, 'now', 'Doing'), ('Platform Launch', 'Add search enpoints', null, 'now', 'Doing'), ('Platform Launch', 'Add authentication endpoints', null, 'now', 'Doing'), ('Platform Launch', 'Research pricing points of various competitors and trial different business models', 'We know what we''re planning to build for version one. Now we need to finalise the first pricing model we''ll use. Keep iterating the subtasks until we have a coherent proposition.', 'now', 'Doing'), ('Platform Launch', 'Conduct 5 wireframe tests', 'Ensure the layout continues to make sense and we have strong buy-in from potential users.', 'now', 'Done'), ('Platform Launch', 'Create wireframe prototype', 'Create a greyscale clickable wireframe prototype to test our asssumptions so far.', 'now', 'Done'), ('Platform Launch', 'Review results of usability tests and iterate', 'Keep iterating through the subtasks until we''re clear on the core concepts for the app.', 'now', 'Done'), ('Platform Launch', 'Create paper prototypes and conduct 10 usability tests with potential customers', null, 'now', 'Done'), ('Platform Launch', 'Market discovery', 'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.', 'now', 'Done'), ('Platform Launch', 'Create paper prototypes and conduct 10 usability tests with potential customers', null, 'now', 'Done'), ('Platform Launch', 'Market discovery', 'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.', 'now', 'Done'), ('Platform Launch', 'Competitor analysis', null, 'now', 'Done'), ('Platform Launch', 'Research the market', 'We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.', 'now', 'Done'), ('Marketing Plan', 'Plan Product Hunt launch', null, 'now', 'Todo'), ('Marketing Plan', 'Share on Show HN', null, 'now', 'Todo'), ('Marketing Plan', 'Write launch article to publish on multiple channels', null, 'now', 'Todo'), ('Roadmap', 'Launch version one', null, 'now', 'Todo'), ('Roadmap', 'Review early feedback and plan next steps for roadmap', 'Beyond the initial launch, we''re keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.', 'now', 'Todo');

INSERT INTO subtask(name, completed, task_id) VALUES ('Sign up page', false, 26), ('Sign in page', false, 26), ('Welcome page', false, 26), ('Search page', false, 29), ('Account page', false, 30), ('Billing page', false, 30), ('Internal testing', false, 31), ('External testing', false, 31), ('Settings - Account page', true, 32), ('Settings - Billing page', true, 32), ('Search page', false, 32), ('Upgrade plan', true, 33), ('Cancel plan', true, 33), ('Update payment method', false, 33), ('Sign up page', true, 34), ('Sign in page', false, 34), ('Welcome page', false, 34), ('Add search endpoint', true, 35), ('Define search filters', false, 35), ('Define user model', true, 36), ('Add auth endpoint', false, 36), ('Research competitor pricing and business models', true, 37), ('Outline a business model that works for our solution', false, 37), ('Talk to potential customers about our proposed solution and ask for fair price expectancy', false, 37), ('Complete 5 wireframe prototype tests', true, 38), ('Create clickable wireframe prototype in Balsamiq', true, 39), ('Meet to review notes from previous tests and plan changes', true, 40), ('Make changes to paper prototypes', true, 40), ('Conduct 5 usability tests', true, 40), ('Create paper prototypes for version one', true, 41), ('Complete 10 usability tests', true, 41), ('Interview 10 prospective customers', true, 42), ('Find direct and indirect competitors', true, 45), ('SWOT analysis for each competitor', true, 45), ('Write up research analysis', true, 46), ('Calculate TAM', true, 46), ('Find hunter', false, 47), ('Gather assets', false, 47), ('Draft product page', false, 47), ('Notify customers', false, 47), ('Notify network', false, 47), ('Launch!', false, 47), ('Draft out HN post', false, 48), ('Get feedback and refine', false, 48), ('Publish post', false, 48), ('Write article', false, 49), ('Publish on LinkedIn', false, 49), ('Publish on Inndie Hackers', false, 49), ('Publish on Medium', false, 49), ('Launch privately to our waitlist', false, 50), ('Launch publicly on PH, HN, etc.', false, 50), ('Interview 10 customers', false, 51), ('Review common customer pain points and suggestions', false, 51), ('Outline next steps for our roadmap', false, 51);