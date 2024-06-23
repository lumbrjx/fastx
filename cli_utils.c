#include "flags.h"
#include "data_io.h"
#include <ctype.h>
#include <pwd.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

void sanitize_input(char *str) {
  char *src = str;
  char *dst = str;

  while (*src) {
    if (!isspace((unsigned char)*src)) {
      *dst++ = *src;
    }
    src++;
  }
  *dst = '\0'; 
}
int process_flags(char *flag, char *arg) {
  if (strcmp(flag, "-i") == 0) {
    flag_i(arg);

  } else if (strcmp(flag, "-g") == 0) {
    Configuration conf = readToml("fastx.toml");

    char cwd[MAX_INPUT_LENGTH]; 
    if (getcwd(cwd, sizeof(cwd)) == NULL) {
      perror("Error getting current working directory");
      return 1;
    }
    char str[MAX_INPUT_LENGTH];
    sprintf(str, "%s/%s/%s", cwd, conf.routesDir, arg);

    flag_g(str);

    printf("Route files has been generated!\n");
  } else if (strcmp(flag, "-h") == 0) {
    flag_h(arg);
  }

  else {
    printf("Invalid flag \"%s\". Run fastx -h show for more info.\n", flag);
    return 1;
  }

  return 0;
}
