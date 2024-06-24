#include "cli_utils.h"
#include "code.h"
#include "data_io.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

void flag_g(const char *f) {
  char *filename = malloc(strlen(f) + strlen("/model.def.ts") + 1);
  if (filename == NULL) {
    perror("Memory allocation error");
    return;
  }
  sprintf(filename, "%s/model.def.ts", f);
  Configuration config;
  FILE *file = fopen(filename, "r");
  if (file == NULL) {
    perror("Error opening model.def.ts file ");
    return;
  }

  char line[MAX_INPUT_LENGTH];
  char names[MAX_INPUT_LENGTH][MAX_INPUT_LENGTH];
  char comments[MAX_INPUT_LENGTH][MAX_INPUT_LENGTH];
  int nameCount = 0;
  int commentCount = 0;

  while (fgets(line, sizeof(line), file)) {
    char *constPos = strstr(line, "const ");
    if (constPos) {
      constPos += 6;
      char *nameStart = constPos;
      while (*nameStart == ' ')
        nameStart++;
      char *nameEnd = strstr(nameStart, " ");
      if (nameEnd) {
        size_t nameLength = nameEnd - nameStart;
        strncpy(names[nameCount], nameStart, nameLength);
        names[nameCount][nameLength] = '\0';
        nameCount++;
      }
    } else if (strncmp(line, "//", 2) == 0) {
      strncpy(comments[commentCount], line, sizeof(line));
      comments[commentCount][strlen(line) - 1] = '\0';
      commentCount++;
    }
  }

  fclose(file);

  file = fopen(filename, "a");
  if (file == NULL) {
    perror("Error opening file for appending");
    return;
  }
  char editedLine[MAX_INPUT_LENGTH];
  long int commentPosition = -1;
  long int currentPosition = 0;
  int edited = 0;

  for (int i = 0; i < nameCount; i++) {

    if (strncmp(comments[i], "// ign", 6) != 0) {
      char s[80];
      sprintf(s, "export interface %sData extends z.infer<typeof %s> { }",
              names[i], names[i]);
      fprintf(file, "\n%s", s);
      Command cmd;

      parseCommand(comments[i], &cmd);

      char modified_code[8192];
      strcpy(modified_code, code);
      char x[1042];
      char y[1042];
      char z[1042];

      sprintf(x, "%sData", names[i]);
      sprintf(y, "%sController", cmd.action);
      sprintf(z, "%sService", cmd.action);

      replaceSubstring(modified_code, "_SCHEMA", names[i]);
      replaceSubstring(modified_code, "_DATA", x);
      replaceSubstring(modified_code, "_OPS", cmd.method);
      replaceSubstring(modified_code, "_ROUTE", cmd.endpoint);
      replaceSubstring(modified_code, "_REST_SCMA_TYPE", cmd.body);
      replaceSubstring(modified_code, "_CONTROLLER", y);
      capitalizeFirstLetter(cmd.body);
      replaceSubstring(modified_code, "_REST_SCEA_TYPE_MAJ", cmd.body);
      replaceSubstring(modified_code, "_SERVICE", z);
      replaceSubstring(modified_code, "_PREFIX", cmd.resource);
      FILE *fp;

      char er[100];
      sprintf(er, "%s/%s.ts", f, cmd.action);

      fp = fopen(er, "w");
      if (fp == NULL) {
        perror("Error opening route file");
        return;
      }

      fprintf(fp, "%s", modified_code);
      fclose(fp);
    }
  }
  fclose(file);
  free(filename);
}
int flag_i(char *arg) {
  // if (strcmp(arg, "new") == 0) {
  //   //curl
  //   printf("Curling for \"new\"\n");
  //
  if (strcmp(arg, "attach") == 0) {
    char input[MAX_INPUT_LENGTH];
    do {
      printf("Where's your routes folder? >> ");
      if (fgets(input, sizeof(input), stdin) == NULL) {
        fprintf(stderr, "Error reading input.\n");
        return 1;
      }

      input[strcspn(input, "\n")] = '\0';

      sanitize_input(input);
    } while (input[0] == '\0');

    Configuration config;
    strcpy(config.routesDir, input);
    struct stat buffer;
    if (stat("fastx.toml", &buffer) == 0) {
      fprintf(stderr, "File '%s' already exists. Aborting write operation.\n",
              "fastx.toml");
      return 1;
      exit(1);
    };
    writeTomlFile("fastx.toml", &config);
    printf("fastx.toml configuration file has been created!\n");
  } else {
    printf("Invalid argument \"%s\" for flag \"-i\". Run fastx -h show for "
           "more info\n",
           arg);
    return 1;
  }
  return 0;
};
int flag_h(char *arg) {
  if (strcmp(arg, "show") == 0) {
    const char *help_string =
        "Usage: fastx [flag] [arg]\n"
        "flag:\n"
        "  -h show               Show this help message and exit.\n"
        "  -i                    Init new fastx Project.\n"
        "  -g                    Generate route files in a given directory.\n"
        "\n"
        "arg:\n"

        "  -i:\n"
        "       attach           Integrate fastx into an existing project.\n"
        "  -g:\n"
        "       <folderName>     Routes folder where the model.def.ts lives.\n";

    printf("%s", help_string);
  } else {
    printf("Invalid argument \"%s\" for flag \"-h\". Run fastx -h show for "
           "more info\n",
           arg);
    return 1;
  }
  return 0;
};
