package cmd

import (
	"fmt"
	
	"github.com/spf13/cobra"

	"github.com/gkwa/itsclam/version"
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of itsclam",
	Long:  `All software has versions. This is itsclam's`,
	Run: func(cmd *cobra.Command, args []string) {
		buildInfo := version.GetBuildInfo()
		fmt.Println(buildInfo)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
