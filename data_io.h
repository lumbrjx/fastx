#define MAX_INPUT_LENGTH 1024

typedef struct {
  char routesDir[MAX_INPUT_LENGTH];
} Configuration;

typedef struct {
  char endpoint[MAX_INPUT_LENGTH];
  char method[MAX_INPUT_LENGTH];
  char resource[MAX_INPUT_LENGTH];
  char body[MAX_INPUT_LENGTH];
  char action[MAX_INPUT_LENGTH];
} Command;


Configuration readToml(const char *filename);
void parseCommand(const char *comment, Command *cmd); 

void writeTomlFile(const char *filename, Configuration *config);
