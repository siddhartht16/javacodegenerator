<% if (classObject) { %>

package <%= classObject.packageName %>.services;

import <%= classObject.packageName %>.models.<%= classObject.className %>;
import <%= classObject.packageName %>.repositories.<%= classObject.repositoryName %>;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins="*", allowedHeaders = "*", allowCredentials = "true")
public class <%= classObject.serviceName %> {

	@Autowired
	<%= classObject.repositoryName %> <%= classObject.repositoryVariable %>;

	@GetMapping("/api/<%= classObject.classSingularName %>s")
	public List<<%= classObject.className %>> findAll<%= classObject.className %>s() {
		return <%= classObject.repositoryVariable %>.findAll();
	}

	@PostMapping("/api/<%= classObject.classSingularName %>s")
	public List<<%= classObject.className %>> create<%= classObject.className %>(@RequestBody <%= classObject.className %> new<%= classObject.className %>) {

		new<%= classObject.className %> = <%= classObject.repositoryVariable %>.save(new<%= classObject.className %>);
		return <%= classObject.repositoryVariable %>.findAll();
	}

	@GetMapping("/api/<%= classObject.classSingularName %>/{<%= classObject.classSingularName %>Id}")
	public <%= classObject.className %> find<%= classObject.className %>ById(@PathVariable("<%= classObject.classSingularName %>Id") int <%= classObject.classSingularName %>Id) {
		return <%= classObject.repositoryVariable %>.findById(<%= classObject.classSingularName %>Id);
	}

	@PutMapping("/api/<%= classObject.classSingularName %>/{<%= classObject.classSingularName %>Id}")
	public <%= classObject.className %> update<%= classObject.className %>(@PathVariable("<%= classObject.classSingularName %>Id") int <%= classObject.classSingularName %>Id, @RequestBody <%= classObject.className %> new<%= classObject.className %>) {

		<%= classObject.className %> <%= classObject.classSingularName %>ToUpdate = <%= classObject.repositoryVariable %>.findById(<%= classObject.classSingularName %>Id);
		<%= classObject.classSingularName %>ToUpdate = <%= classObject.repositoryVariable %>.save(<%= classObject.classSingularName %>ToUpdate);
		return <%= classObject.repositoryVariable %>.findById(<%= classObject.classSingularName %>Id);
	}

	@DeleteMapping("/api/<%= classObject.classSingularName %>/{<%= classObject.classSingularName %>Id}")
	public List<<%= classObject.className %>> delete<%= classObject.className %>(@PathVariable("<%= classObject.classSingularName %>Id") int <%= classObject.classSingularName %>Id) {

		<%= classObject.repositoryVariable %>.deleteById(<%= classObject.classSingularName %>Id);
		return <%= classObject.repositoryVariable %>.findAll();
	}
}

            <% } %>

